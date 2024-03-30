import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector((state) => state.user.user); // Assuming user role is stored in Redux state
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if user not logged in
    }
  }, [user, router]);

  return children;
}
