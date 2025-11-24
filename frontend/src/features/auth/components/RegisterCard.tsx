import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/AuthProvider"
import { Label } from "@radix-ui/react-label"
import { useMutation } from "@tanstack/react-query"
import { sendRegisterRequest } from "../api"
import { useRef, useState } from "react"

export const RegisterCard = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const registerRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => sendRegisterRequest(email, password, displayName),
    onSuccess: (res) => {
      if (res.success) {
        login(res.data);
      }
    },
    onError: (err) => {
      console.error(err);
      setPassword("");
      setError("Email already in use, please try again.");
      registerRef.current?.focus();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle>Register a new account</CardTitle>
        <CardDescription>
          Enter your email below to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="registerEmail">Display name</Label>
              <Input
                ref={registerRef}
                id="registerName"
                type="name"
                placeholder="Name..."
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="registerEmail">Email</Label>
              <Input
                ref={registerRef}
                id="registerEmail"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="registerPassword">Password</Label>
              </div>
              <Input id="registerPassword" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          {mutation.isPending ? "Registering..." : "Register"}
        </Button>
        {error && <p className="mt-4 text-xs text-red-400 text-start p-0">{error}</p>}
      </CardFooter>
    </div>
  )
}