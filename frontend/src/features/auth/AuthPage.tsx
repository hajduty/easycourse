import { useNavigate } from "react-router";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "../../components/animate-ui/components/animate/tabs"
import { Card } from "../../components/ui/card"
import { LoginCard } from "./components/LoginCard"
import { RegisterCard } from "./components/RegisterCard";
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';
import { useAuth } from "@/providers/AuthProvider";

function AuthPage() {
  usePageTitle("Auth - EasyCourse");
  const {authenticated} = useAuth();
  const navigate = useNavigate();

  if (authenticated) {
    navigate("/");
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-neutral-950">
      <BubbleBackground
        interactive={true}
        draggable={false}
        className="absolute inset-0 flex items-center justify-center rounded-xl opacity-1 saturate-0"
      />
      <Tabs defaultValue="login" className="w-96">
        <TabsList className="px-4 bg-neutral-900">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <Card className="bg-neutral-900/60">
          <TabsContents className="py-4">
            <TabsContent value="login">
              <LoginCard />
            </TabsContent>
            <TabsContent value="register">
              <RegisterCard />
            </TabsContent>
          </TabsContents>
        </Card>
      </Tabs>
    </div>
  )
}

export default AuthPage;