/// <reference path="../.astro/types.d.ts" />

type AuthUser = {
  id: string;
  email?: string;
};

declare namespace App {
  interface Locals {
    user: AuthUser | null;
    session: unknown | null;
  }
}

