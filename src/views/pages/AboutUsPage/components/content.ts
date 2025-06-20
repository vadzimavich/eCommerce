import { MemberData } from '../../../../models/types/common-types';

export const enum Team {
  Title = 'We are a CODERS',
  Description = 'We are a Coders team from Belarus that has developed a unique online store dedicated to the sale of recycled plastic products. We have not just created a website, but built an entire ecosystem that combines sustainability and innovation, embodying dreams of a clean future and technology.',
  Title_mission = 'Our mission',
  Description_mission = 'We believe that each of us can contribute to the protection of the environment. Our goal is to inspire people to choose environmentally friendly products and make the world a better place, step by step.',
  Source_img = '/assets/about/bottle.jpg',
}

export const enum Platform {
  Title = 'Learning platform RS School',
  Description = 'This project is the final assignment on the RS School educational platform, which trains qualified Frontend developers. We would like to express our sincere gratitude to our wonderful mentors who have supported and inspired us throughout this long but surprisingly interesting journey.',
  Source_img = '/assets/about/mouse.jpg',
  Url = 'https://rs.school/',
}

export const enum ButtonDesc {
  Read = 'Read more',
  Hide = 'Hide',
}

export const Tanya: MemberData = {
  name: 'Tatiana Goryanina',
  description:
    'In 2024, Tatiana made the bold decision to leave her stable and highly paid position in order to fully devote herself to learning programming. Her passion for creating web applications and interfaces inspired her to take this step. Tatiana is passionate about learning new technologies and mastering the skills that allow her to bring her ideas to life. She loves to see the result of her work and enjoys the development process. In the future, Tatiana dreams of creating her own application that will benefit people and inspire them to new achievements. Her single-mindedness and dedication make her a true example to others.',
  image: '/assets/about/tanya.jpg',
  contribution: ['Registration page', 'Product page', 'About us page', 'Project design', 'Tests'],
  gitHub: 'https://github.com/tanyagoryaninaD',
  roles: ['frontend', 'design'],
};

export const Denis: MemberData = {
  name: 'Denis Nedelko',
  description:
    'Denis is a talented and motivated person from Brest, who always strives for new knowledge and achievements. Despite the fact that his journey is just beginning, he is already showing interest in various fields, including technology and programming. Denis is actively learning new skills to expand his horizons and realize his ideas. His desire for self-development and willingness to overcome difficulties make him an inspiring example for others. In the future, Denis dreams of making his ambitions come true and contributing to the world of technology.',
  image: '/assets/about/denis.jpg',
  contribution: ['Home page', 'Catalog page', 'Header', 'Footer', 'Project routing and configuration'],
  gitHub: 'https://github.com/weekden',
  roles: ['frontend', 'backend'],
};

export const Andrey: MemberData = {
  name: 'Andrey Kaspiarovich',
  description:
    'Andrey is an energetic and ambitious man from Rogachev who strives for constant development and self—improvement. He is interested in new technologies and actively studies various aspects of programming. Despite the challenges he faces, Andrey does not stop there and continues to move forward. His passion and perseverance inspire others, and his dream of creating something meaningful in the world of technology pushes him to new achievements. Andrey believes that perseverance and passion for his work will help him realize all his plans in the future.',
  image: '/assets/about/andrey.jpg',
  contribution: ['Login page', 'Profile page', 'Basket page', 'Team Leader'],
  gitHub: 'https://github.com/vadzimavich',
  roles: ['frontend', 'team lead'],
};
