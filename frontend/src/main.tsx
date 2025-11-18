import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPage from './features/auth/AuthPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from './providers/AuthProvider.tsx'
import { HomePage } from './features/home/HomePage.tsx'
import { CoursePage } from './features/course/CourseBrowser.tsx'
import { CourseLayout } from './features/course/learn-view/CourseLayout.tsx'
import { CourseDashboard } from './features/course/dashboard/CourseDashboard.tsx'
import { CourseCreate } from './features/course/CourseCreate.tsx'
import { CourseEditor } from './features/course/editor-view/CourseEditor.tsx'
import { Layout } from './features/Layout.tsx'
import { EditorLayout } from './features/course/editor-view/EditorLayout.tsx'
import { SectionEditor } from './features/course/editor-view/SectionEditor.tsx'
import './styles/_variables.scss';
import './styles/_keyframe-animations.scss';
import './index.css';
import { CourseInfo } from './features/course/learn-view/CourseInfo.tsx';
import { SectionView } from './features/course/learn-view/SectionView.tsx';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index path="/" element={<HomePage />} />
              <Route path="course" element={<CoursePage />} />
              <Route path="course/:courseId" element={<CourseLayout />} >
                <Route index element={<CourseInfo/>}></Route>
                <Route path="section/:sectionId" element={<SectionView/>}/>
              </Route>
              <Route path="dashboard" element={<CourseDashboard />} />
              <Route path="course/create" element={<CourseCreate />} />
              <Route path="course/editor/:courseId" element={<EditorLayout />} >
                <Route index element={<CourseEditor />} />
                <Route path="section/:sectionId" element={<SectionEditor/>}/>
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