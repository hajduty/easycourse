import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "../../components/animate-ui/components/animate/tabs"
import { Card } from "../../components/ui/card"
import { LoginCard } from "./components/LoginCard"
import { RegisterCard } from "./components/RegisterCard";
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble';

function AuthPage() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-stone-950">
          <BubbleBackground
      interactive={true}
      draggable={false}
      className="absolute inset-0 flex items-center justify-center rounded-xl opacity-10 sepia-100"
    />
      <Tabs defaultValue="login" className="w-96">
        <TabsList className="px-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <Card className="">
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
