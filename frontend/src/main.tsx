import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuthPage from './features/auth/AuthPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from './providers/AuthProvider.tsx'
import { HomePage } from './features/home/HomePage.tsx'
import { CoursePage } from './features/course/CourseLearnHome.tsx'
import { CourseInfo } from './features/course/CourseInfo.tsx'
import { CourseDashboard } from './features/course/dashboard/CourseDashboard.tsx'
import { CourseCreate } from './features/course/CourseCreate.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<HomePage></HomePage>} />
            <Route path="course" element={<CoursePage />} />
            <Route path="course/:courseId" element={<CourseInfo />} />
            <Route path="dashboard" element={<CourseDashboard/>}/>
            <Route path="course/create" element={<CourseCreate/>}/>
            <Route element={<AuthPage />} path="auth"></Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)