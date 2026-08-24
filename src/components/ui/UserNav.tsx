"use client";

import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

export function UserNav() {
  return (
    <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Profile"
          labelIcon={<User className="w-4 h-4" />}
          href="/profile"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
}
