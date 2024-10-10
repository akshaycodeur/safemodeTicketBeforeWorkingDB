import { Project } from "@prisma/client";

export interface ProjectQuery {
  orderBy: keyof Project;
  page: string;
}
