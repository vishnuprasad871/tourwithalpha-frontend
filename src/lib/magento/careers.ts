import { graphqlFetch } from './graphql';

export interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  salary_range: string;
  created_at: string;
}

interface ListCareersResponse {
  listCareers: {
    total_count: number;
    success: boolean;
    careers: Career[];
  };
}

interface GetCareerResponse {
  getCareer: {
    success: boolean;
    message: string;
    career: Career;
  };
}

interface SubmitApplicationResponse {
  submitJobApplication: {
    success: boolean;
    message: string;
    application_id: number;
  };
}

export interface ApplicationInput {
  career_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_base64?: string;
  resume_filename?: string;
}

export async function listCareers(pageSize = 20, currentPage = 1): Promise<{ careers: Career[]; total: number }> {
  const query = `
    query ListCareers($pageSize: Int, $currentPage: Int) {
      listCareers(pageSize: $pageSize, currentPage: $currentPage) {
        total_count
        success
        careers {
          id
          title
          department
          location
          employment_type
          description
          requirements
          salary_range
          created_at
        }
      }
    }
  `;
  try {
    const data = await graphqlFetch<ListCareersResponse>(query, { pageSize, currentPage });
    return { careers: data.listCareers.careers, total: data.listCareers.total_count };
  } catch {
    return { careers: [], total: 0 };
  }
}

export async function getCareer(id: number): Promise<Career | null> {
  const query = `
    query GetCareer($id: Int!) {
      getCareer(id: $id) {
        success
        message
        career {
          id
          title
          department
          location
          employment_type
          description
          requirements
          salary_range
          created_at
        }
      }
    }
  `;
  try {
    const data = await graphqlFetch<GetCareerResponse>(query, { id });
    return data.getCareer.success ? data.getCareer.career : null;
  } catch {
    return null;
  }
}

export async function submitJobApplication(
  input: ApplicationInput
): Promise<{ success: boolean; message: string; application_id?: number }> {
  const query = `
    mutation SubmitApplication($input: JobApplicationInput!) {
      submitJobApplication(input: $input) {
        success
        message
        application_id
      }
    }
  `;
  const data = await graphqlFetch<SubmitApplicationResponse>(query, { input });
  return data.submitJobApplication;
}

export function formatEmploymentType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDepartment(dept: string): string {
  return dept.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
