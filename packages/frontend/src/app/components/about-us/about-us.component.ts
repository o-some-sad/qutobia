import { Component } from '@angular/core';
import { IconsModule } from '../../modules/icons/icons.module';

@Component({
  selector: 'app-about-us',
  imports: [IconsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  contributors =[
    {
      name: 'Ahmed Ramadan',
      img: '/AhmedRamadan.jpeg',
      email:'ahmedramadanmohamedoweis@gmail.com',
      linkedin:`https://www.linkedin.com/in/ahmed-ramadan-313173288`,
      github:`https://github.com/ahmedoweis72`,
      desc: `  Technical Contributor & Researcher  
                As a dedicated team member in this Qutobia project, I played a key role in researching, structuring, and refining technical content to ensure clarity and accuracy.  
                With a strong interest in technology and a passion for simplifying complex concepts, I focused on making information accessible and engaging for a diverse audience.  
                Beyond technical expertise, I am committed to continuous learning, particularly in language mastery and cross-cultural understanding.  
                Collaborating with my team, I contributed to a well-structured and insightful resource that bridges knowledge gaps and enhances learning experiences.
              `,
    },//ahmed ramadan
    
  ]

}
