import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { sendLoginRequest } from "../api"
import { useAuth } from "@/providers/AuthProvider"

export const LoginCard = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: () => sendLoginRequest(email, password),
    onSuccess: (res) => {
      if (res.success) {
        login(res.data);
      }
    },
    onError: (err) =>{
      console.error(err);
      setPassword("");
      setError("Login failed, Please check your credentials and try again.");
      loginRef.current?.focus();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="loginPassword">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input ref={loginRef} id="loginPassword" type="password" required current-password="true" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </Button>
        {error && <p className="mt-4 text-xs text-red-400 text-start p-0">{error}</p>}
      </CardFooter>
    </div>
  )
}