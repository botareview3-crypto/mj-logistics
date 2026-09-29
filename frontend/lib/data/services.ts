/**
 * Additional service lines for MJ Logistics Enterprise.
 * Used by /services, the header menu, the homepage, the About page, the
 * footer and the contact form — edit wording here, in one place.
 */
export interface ServiceLine {
  id: string; // also the #anchor on /services
  title: string;
  short: string; // one-line description for cards
  summary: string;
  items: string[];
  icon: 'FlaskConical' | 'Sun' | 'Workflow';
}

export const SERVICES: ServiceLine[] = [
  {
    id: 'space-logistics-laboratory',
    title: 'Space Logistics, Laboratory Equipment Supply and Services',
    short: 'Space logistics, plus laboratory equipment supply and services.',
    summary:
      'We supply laboratory equipment and provide space logistics and related services for businesses, institutions and projects that need them.',
    items: [
      'Space logistics',
      'Laboratory equipment supply',
      'Laboratory services',
    ],
    icon: 'FlaskConical',
  },
  {
    id: 'solar-energy',
    title: 'Solar Energy System and Equipment Supply',
    short: 'Solar energy systems and equipment supplied to order.',
    summary:
      'We supply solar energy systems and the equipment that goes with them, sourced to suit the requirements of each client.',
    items: ['Solar energy systems', 'Solar equipment supply'],
    icon: 'Sun',
  },
  {
    id: 'consultancy',
    title: 'Consultancy Services',
    short: 'Supply chain management and project management consultancy.',
    summary:
      'We offer consultancy for all supply chain management services and for project management.',
    items: [
      'Supply chain management consultancy (all services)',
      'Project management consultancy',
    ],
    icon: 'Workflow',
  },
];
