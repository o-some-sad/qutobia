import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Camera, Heart, Github, Monitor, Sun, Moon, User, Book, BarChart, ArrowRight, Menu } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Camera,
  Heart,
  Github,
  Monitor,
  Sun,
  Moon,
  User,
  Book,
  BarChart,
  ArrowRight,
  Menu
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }