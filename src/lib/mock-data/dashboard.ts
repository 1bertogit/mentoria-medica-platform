export interface Event {
  id: number;
  title: string;
  date: string;
  type: 'masterclass' | 'mentoria' | 'workshop' | 'webinar';
  description?: string;
  instructor?: string;
  duration?: string;
}

export const eventsData: Event[] = [
  {
    id: 1,
    title: "Masterclass: Rinoplastia Avançada",
    date: "2025-09-15T14:00:00",
    type: "masterclass",
    description: "Técnicas avançadas em rinoplastia estruturada",
    instructor: "Dr. Ricardo Monteiro",
    duration: "2h"
  },
  {
    id: 2,
    title: "Mentoria: Casos Complexos",
    date: "2025-09-20T19:00:00", 
    type: "mentoria",
    description: "Discussão de casos clínicos complexos",
    instructor: "Dr. Ana Couto",
    duration: "1h30"
  },
  {
    id: 3,
    title: "Workshop: Enxertos de Gordura",
    date: "2025-09-25T15:00:00",
    type: "workshop", 
    description: "Técnicas de lipoenxertia facial",
    instructor: "Dr. Sofia Ferreira",
    duration: "3h"
  }
];