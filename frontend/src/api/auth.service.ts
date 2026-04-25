import { delay } from "./client";
import { mockUser } from "@/lib/mock-data";
import type { User } from "@/types";

export const authService = {
  login: (email: string, _password: string) =>
    delay<User>({ ...mockUser, email }, 600),
  register: (email: string, _password: string, name: string) =>
    delay<User>({ ...mockUser, email, name }, 600),
  logout: () => delay<void>(undefined, 100),
  me: () => delay<User>(mockUser, 200),
};
