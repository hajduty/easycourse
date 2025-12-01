import { useAuth } from "@/providers/AuthProvider";
import { useParams } from "react-router";
import { useUser } from "./hooks/useUser";
import { imageUrl } from "@/lib/apiClient";

export const UserPage = () => {
  const { userId: routeUserId } = useParams();
  const { user: authUser } = useAuth();

  const resolvedUserId = routeUserId ?? authUser?.id;

  const user = useUser(resolvedUserId!);

  return (
    <>
      <div className="mx-auto w-full lg:max-w-6xl md:max-w-3xl sm:max-w-xl p-8 pt-20">
        <h1 className="text-2xl font-medium mb-4 text-white pb-8">Profile Info</h1>
        <div className="flex flex-col gap-2">
          <img src={imageUrl + user.data?.imagePath} alt="" className="h-48 w-48 object-cover rounded-full" />
          <p className="text-white text-2xl">{user?.data?.username}</p>
          <p></p>
        </div>
      </div>
    </>
  )
}