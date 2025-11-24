import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import type { Content, Editor } from '@tiptap/react';
import { useSection } from '../../hooks/section/useGetSection';
import { useUpdateSection } from '../../hooks/section/useUpdateSection';
import { AlertDialog, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { QuizEditor } from './QuizEditor';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@/components/animate-ui/primitives/base/collapsible';

export const SectionEditor = () => {
  const { sectionId, courseId } = useParams();

  const loadedSection = useSection(courseId, sectionId);
  const updateSection = useUpdateSection();

  const [content, setContent] = useState<Content>("");
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [loadedForSection, setLoadedForSection] = useState<string | null>(null);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [conflictData, setConflictData] = useState<{
    local: Content;
    server: Content;
  } | null>(null);
  const saveTimeoutRef = useRef<any>(null);
  const currentSectionRef = useRef(sectionId);
  const isSavingRef = useRef(false);

  // Update current section ref and reset loading state when sectionId changes
  useEffect(() => {
    currentSectionRef.current = sectionId;
    setIsContentLoaded(false);
    setLoadedForSection(null);
    setShowConflictAlert(false);
    setConflictData(null);
  }, [sectionId]);

  useEffect(() => {
    const loadContent = async () => {
      // Wait for the correct section data to load
      if (!loadedSection.data || loadedSection.data.sectionId !== sectionId) {
        return;
      }

      let localData = null;
      const raw = localStorage.getItem(`editorContent:${sectionId}`);
      if (raw) {
        try { localData = JSON.parse(raw); } catch { }
      }

      const apiData = loadedSection.data;
      let apiContent = null;
      if (apiData?.sectionData) {
        try { apiContent = JSON.parse(apiData.sectionData); } catch { }
      }

      const localTime = localData?.lastUpdated ?? 0;
      const apiTime = apiData?.lastUpdated ? new Date(apiData.lastUpdated).getTime() : 0;

      // Check if there's a conflict (local is newer than server)
      if (localData && localTime > apiTime && apiContent) {
        setConflictData({
          local: localData.content,
          server: apiContent
        });
        setShowConflictAlert(true);
        // Don't set content yet, wait for user choice
        return;
      }

      const finalContent = (localData && localTime > apiTime)
        ? localData.content
        : apiContent || "";

      setContent(finalContent);
      setLoadedForSection(sectionId!);
      setIsContentLoaded(true);
    };

    loadContent();

    // Clear any pending saves when switching sections
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sectionId, loadedSection.data]);

  const handleContentChange = useCallback(
    (newContent: Editor) => {
      setContent(newContent.getJSON());

      // Get the current section at call time (not closure time)
      const targetSectionId = currentSectionRef.current;

      // Save to localStorage immediately
      localStorage.setItem(
        `editorContent:${targetSectionId}`,
        JSON.stringify({
          content: newContent.getJSON(),
          lastUpdated: Date.now()
        })
      );

      // Debounce API calls
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        // Double-check we're still on the same section
        if (currentSectionRef.current !== targetSectionId) {
          return;
        }

        // Prevent concurrent saves
        if (isSavingRef.current) {
          return;
        }

        if (loadedSection.data) {
          isSavingRef.current = true;

          try {
            await updateSection.mutateAsync({
              data: {
                ...loadedSection.data,
                sectionData: JSON.stringify(newContent.getJSON()),
                lastUpdated: new Date(),
                readingTime: Math.ceil((newContent.getText().trim().split(/\s+/).filter(Boolean).length) / 150)
              },
            });

            // Success! Remove localStorage since it's now in sync with server
            localStorage.removeItem(`editorContent:${targetSectionId}`);
          } catch (error) {
            console.error('Failed to save section:', error);
            // Keep localStorage data - it will be synced later or on next load
          } finally {
            isSavingRef.current = false;
          }
        }
      }, 1000); // Debounce for 1 second
    },
    [loadedSection.data, updateSection]
  );

  const handleKeepLocal = () => {
    if (conflictData) {
      setContent(conflictData.local);
      setLoadedForSection(sectionId!);
      setIsContentLoaded(true);
      setShowConflictAlert(false);

      // Try to save local data to server
      if (loadedSection.data) {
        updateSection.mutate({
          data: {
            ...loadedSection.data,
            sectionData: JSON.stringify(conflictData.local),
            lastUpdated: new Date(),
          },
        }, {
          onSuccess: () => {
            // Remove localStorage once synced
            localStorage.removeItem(`editorContent:${sectionId}`);
          }
        });
      }
    }
  };

  const handleKeepServer = () => {
    if (conflictData) {
      setContent(conflictData.server);
      setLoadedForSection(sectionId!);
      setIsContentLoaded(true);
      setShowConflictAlert(false);

      // Remove stale localStorage data
      localStorage.removeItem(`editorContent:${sectionId}`);
    }
  };

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleQuizChange = useCallback(
    (newQuizData: any) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      setSaveStatus("saving");

      saveTimeoutRef.current = setTimeout(async () => {
        if (!loadedSection.data) return;

        try {
          await updateSection.mutateAsync({
            data: {
              ...loadedSection.data,
              sectionQuestions: JSON.stringify(newQuizData),
              lastUpdated: new Date(),
            },
          });

          setSaveStatus("saved");

          setTimeout(() => setSaveStatus("idle"), 1500);
        } catch (error) {
          console.error("Failed to save quiz data:", error);
          setSaveStatus("error");
        }
      }, 800);
    },
    [sectionId, loadedSection.data, updateSection]
  );

  const parsedQuizData = (() => {
    const raw = loadedSection.data?.sectionQuestions;
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  })();

  return (
    <div className="flex xl:flex-row flex-col p-0 m-0 text-white bg-stone-950 h-full w-full overflow-x-hidden">
      <div className="w-full overflow-auto min-h-0 min-w-0 h-full">
        {showConflictAlert && conflictData ? (
          <div className="flex items-center justify-center h-full p-8">
            <AlertDialog defaultOpen={true}>
              <AlertDialogContent className='text-white'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sync Conflict Detected</AlertDialogTitle>
                  <AlertDialogDescription className='font-thin'>
                    Your local changes are newer than the server version. This might happen if you edited offline or the save failed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button onClick={handleKeepLocal} variant="default">
                    Keep My Local Changes
                  </Button>
                  <Button onClick={handleKeepServer} variant="outline">
                    Use Server Version
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : isContentLoaded && loadedForSection === sectionId ? (
          <SimpleEditor
            key={sectionId}
            content={content}
            onChange={handleContentChange}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading...</p>
          </div>
        )}
      </div>
      <div className="xl:w-1/5 border-l xl:border-t-0 border-t xl:block">
        {/* Mobile-only collapse trigger */}
        <div className="xl:hidden border-b">
          <Collapsible>
            <CollapsibleTrigger className={'w-full p-2 border-y hover:bg-stone-900 transition cursor-pointer font-semibold bg-stone-900/30'}>
              Questions
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <QuizEditor
                key={sectionId}
                quizData={parsedQuizData}
                onSave={handleQuizChange}
                saveStatus={saveStatus}
              />
            </CollapsiblePanel>
          </Collapsible>
        </div>

        <div className="hidden xl:block p-2">
          <QuizEditor
            key={sectionId}
            quizData={parsedQuizData}
            onSave={handleQuizChange}
            saveStatus={saveStatus}
          />
        </div>
      </div>

    </div>
  );
};