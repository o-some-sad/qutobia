import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Camera, Heart, Github, Monitor, Sun, Moon, User, Book, BarChart, ArrowRight, Menu, Home, Bell, Package, Plus } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Home,
  Camera,
  Heart,
  Github,
  Monitor,
  Sun,
  Moon,
  User,
  Book,
  BarChart,
  Package,
  ArrowRight,
  Menu,
  Bell,
  Plus
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