import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiddenComponent} from './hidden.component'
import {Routes, RouterModule} from '@angular/router';
import {HighscoresComponent} from './highscores/highscores.component';
import {FriendlistComponent} from './friendlist/friendlist.component';
import {ChatboxComponent} from './friendlist/chatbox/chatbox.component';
import {OrderModule} from 'ngx-order-pipe';
import { GamelistComponent } from './gamelist/gamelist.component';
import { GametypesComponent } from './gametypes/gametypes.component';
import {GametypesModule} from './gametypes/gametypes.module';
import {PestenComponent} from './gametypes/pesten/pesten.component';
import { GamebarComponent } from './gamebar/gamebar.component';

const hiddenRoutes: Routes = [
  {path:'', component: HiddenComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data'
      },
      // {path:'lobby', redirectTo: ''},
      {path:'lobby', component: GamelistComponent},
      {path:'highscores', component: HighscoresComponent},
      {path:'pesten', component: PestenComponent}
    ] 
  }
]

@NgModule({
  declarations: [
    HiddenComponent,
    HighscoresComponent,
    FriendlistComponent,
    ChatboxComponent,
    GamelistComponent,
    GametypesComponent,
    GamebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(hiddenRoutes),
    OrderModule,
    GametypesModule
  ],
  exports: [
  ]
})

export class HiddenModule {}