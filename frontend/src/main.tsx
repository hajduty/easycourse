import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPage from './features/auth/AuthPage.tsx'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from './providers/AuthProvider.tsx'
import { HomePage } from './features/home/HomePage.tsx'
import { CoursePage } from './features/course/learn/CourseBrowserPage.tsx'
import { CourseEditor } from './features/course/create/editor-view/CourseEditor.tsx'
import { Layout } from './features/Layout.tsx'
import { EditorLayout } from './features/course/create/editor-view/EditorLayoutPage.tsx'
import { SectionEditor } from './features/course/create/editor-view/SectionEditor.tsx'
import './styles/_variables.scss';
import './styles/_keyframe-animations.scss';
import './index.css';
import CourseCreateBrowser from './features/course/create/CourseCreatePage.tsx';
import { SectionView } from './features/course/learn/learn-view/SectionView.tsx';
import { CourseInfo } from './features/course/learn/learn-view/CourseInfo.tsx';
import { CourseLayout } from './features/course/learn/learn-view/CourseLayoutPage.tsx';
const queryClient = new QueryClient();

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index path="/" element={<HomePage />} />
              <Route path="course" element={<CoursePage />} />
              <Route path="course/:courseId" element={<CourseLayout />} >
                <Route index element={<CourseInfo />}></Route>
                <Route path="section/:sectionId" element={<SectionView />} />
              </Route>
              <Route path="course/create" element={<CourseCreateBrowser />} />
              <Route path="course/editor/:courseId" element={<EditorLayout />} >
                <Route index element={<CourseEditor />} />
                <Route path="section/:sectionId" element={<SectionEditor />} />
              </Route>
            </Route>
            <Route element={<AuthPage />} path="auth"></Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)