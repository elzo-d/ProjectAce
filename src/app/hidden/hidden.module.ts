import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiddenComponent} from './hidden.component'
import {Routes, RouterModule} from '@angular/router';
import {HighscoresComponent} from './highscores/highscores.component';
import {FriendlistComponent} from './friendlist/friendlist.component';
import {ChatboxComponent} from './friendlist/chatbox/chatbox.component';
import {OrderModule} from 'ngx-order-pipe';

const hiddenRoutes: Routes = [
  {path:'', component: HiddenComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data'
      },
      {path:'lobby', redirectTo: ''},
      {path:'highscores', component: HighscoresComponent}
    ] 
  }
]

@NgModule({
  declarations: [
    HiddenComponent,
    HighscoresComponent,
    FriendlistComponent,
    ChatboxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(hiddenRoutes),
    OrderModule
  ],
  exports: [
  ]
})

export class HiddenModule {}