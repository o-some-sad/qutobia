import { Component } from '@angular/core';
import { IconsModule } from '../../modules/icons/icons.module';
import { aboutUS } from '../../interfaces/about-us.interface';
import _ from 'lodash';

const contributors: aboutUS[] = [
  {
    name: 'Ahmed Ramadan',
    img: '/AhmedRamadan.jpeg',
    email: 'ahmedramadanmohamedoweis@gmail.com',
    linkedin: `https://www.linkedin.com/in/ahmed-ramadan-313173288`,
    github: `https://github.com/ahmedoweis72`,
    title: 'The Backend Striker',
    desc: `Backend development and football—two things he’s equally passionate about. He treats databases like a well-organized locker room and APIs like perfect through-passes. Just don’t expect him to code when his team is playing; priorities exist.`,
  },
  {
    name: 'Ahmed Zaki',
    img: '/AhmedZaki.jpeg',
    email: 'ahmedzaki789123@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ahmed-zaki-7325b9301/',
    github: 'https://github.com/ahmedzaki147258/',
    title: 'The Silent Thinker',
    desc: `He doesn’t say much, but when he does, it’s either a deep insight or a brutally honest code review. With an analytical mind sharper than a binary search(or ternary, ever heard of it tho?), he’s the one making sure everything actually makes sense (and that no one introduces an infinite loop by accident).`,
  },
  {
    name: 'Jana Hazem',
    img: 'https://unsplash.it/360/360?2',
    email: '',
    github: '',
    linkedin: '',
    title: 'The Pixel Perfectionist',
    desc: `When she's not crafting sleek user interfaces, she's probably redesigning her wardrobe. Passionate about frontend design and fashion, she believes that both code and couture should be clean, elegant, and delicate.`,
  },
  {
    name: 'Mohammed Amr',
    img: '/mohammed-amr.png',
    email: 'next.mohammed.amr@gmail.com',
    github: 'https://github.com/ilawy',
    linkedin: 'https://www.linkedin.com/in/ilawy/',
    title: 'The Mastermind',
    desc: `The team's technical guru and go-to problem solver. He knows everything… and if he doesn’t, he’ll find out before you finish your sentence. Just don’t ask him the same question twice unless you enjoy watching someone suppress their rage in real-time.`,
  },
  {
    name: 'Osama Ismail',
    img: 'https://unsplash.it/360/360',
    email: '',
    github: '',
    linkedin: '',
    title: 'The Sleeping Coder',
    desc: `He operates in two states: writing code or recharging in deep sleep mode. If you see him awake, it's either a bug kept him up, or he’s just deployed something that "should work fine in production" (fingers crossed).`,
  },
];

@Component({
  selector: 'app-about-us',
  imports: [IconsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  get contributors() {
    return _.chunk(contributors, 2);
  }
}
