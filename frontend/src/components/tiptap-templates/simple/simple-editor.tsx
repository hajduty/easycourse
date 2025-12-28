"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

import Youtube from '@tiptap/extension-youtube'

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"

// --- Components ---

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import { TvMinimalPlay } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button as ShadButton } from "@/components/ui/button"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"

import CodeBlockShiki from 'tiptap-extension-code-block-shiki'

const MainToolbarContent = ({

  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <ToolbarSeparator />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

function sanitizeJson(json: any) {
  if (json.content && Array.isArray(json.content)) {
    json.content = json.content.map((node: { type: string; text: null | undefined; content: any }) => {
      if (node.type === 'text' && (node.text === null || node.text === undefined)) {
        return null;  // Remove invalid text nodes
      }
      if (node.content) {
        node.content = sanitizeJson(node).content;  // Recurse
      }
      return node;
    }).filter(Boolean);  // Filter out nulls
  }
  return json;
}

export function SimpleEditor({ content, onChange, editable = true }: { content: any, onChange?: (newContent: any) => void, editable?: boolean }) {
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )

  const toolbarRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0);

  const [ytDialogOpen, setYtDialogOpen] = useState(false)
  const [ytUrl, setYtUrl] = useState("")

  const insertYoutube = () => {
    if (!editor || !ytUrl) return
    editor.commands.setYoutubeVideo({
      src: ytUrl,
      width: 360,   // ignored by CSS
      height: 160,  // ignored by CSS
    })
    setYtUrl("")
    setYtDialogOpen(false)
  }

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }
      ),
      CodeBlockShiki.configure({
        defaultLanguage: 'csharp',
        themes: {
          light: 'dark-plus',
          dark: 'dark-plus',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: typeof content === 'object' ? sanitizeJson(content) : content,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const count = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
      setWordCount(count);
    },
    editable: editable,
  })

  useEffect(() => {
    if (!editor || !onChange) return;

    const handleUpdate = () => {
      const json = editor.getJSON();
      onChange(json);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange]);

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [toolbarStyle, setToolbarStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const scrollY = useScrollPosition()

  useEffect(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    setToolbarStyle({
      top: Math.max(rect.top, 55),
      left: rect.left,
      width: rect.width,
    });
  }, [scrollY]);

  console.log(editor?.getJSON())

  return (
    <div className=" h-full flex flex-col scrollbar-hide" ref={wrapperRef}>
      <EditorContext.Provider value={{ editor }}>
        {editable &&
          <Toolbar
            ref={toolbarRef}
            style={{
              ...({
                position: 'fixed',
                top: isMobile ? toolbarStyle.top - 4 : toolbarStyle.top,
                left: `${toolbarStyle.left}px`,
                width: `${toolbarStyle.width}px`,
                border: 0
              }),
            }}
            className="fixed z-2000 bg-neutral-950"
          >
            <div className="flex justify-center align-middle items-center w-full gap-2">
              <div className=" text-sm text-neutral-400">
                {wordCount} words
              </div>
              {mobileView === "main" ? (
                <MainToolbarContent
                  onHighlighterClick={() => setMobileView("highlighter")}
                  onLinkClick={() => setMobileView("link")}
                  isMobile={isMobile}
                />
              ) : (
                <MobileToolbarContent
                  type={mobileView === "highlighter" ? "highlighter" : "link"}
                  onBack={() => setMobileView("main")}
                />
              )}

              <ShadButton variant={'ghost'} className="text-xs" onClick={() => setYtDialogOpen(true)}>
                <TvMinimalPlay />
                Add Video
              </ShadButton>
              <AlertDialog open={ytDialogOpen} onOpenChange={setYtDialogOpen}>
                <AlertDialogContent className="dark text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Insert YouTube Video</AlertDialogTitle>
                    <AlertDialogDescription>
                      Paste the YouTube video URL below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                  />
                  <AlertDialogFooter className="flex justify-end gap-2 mt-2">
                    <ShadButton onClick={() => setYtDialogOpen(false)}>Cancel</ShadButton>
                    <ShadButton onClick={insertYoutube}>Insert</ShadButton>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Toolbar>
        }
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content min-h-full"
        />

      </EditorContext.Provider>
    </div>
  )
}

export default SimpleEditor;
