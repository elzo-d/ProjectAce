import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {OrderModule} from 'ngx-order-pipe';

import {HiddenComponent} from './hidden.component'
import {HighscoresComponent} from './highscores/highscores.component';
import {FriendlistComponent} from './friendlist/friendlist.component';
import {ChatboxComponent} from './friendlist/chatbox/chatbox.component';
import {GamelistComponent} from './gamelist/gamelist.component';
import {GametypesComponent} from './gametypes/gametypes.component';
import {GametypesModule} from './gametypes/gametypes.module';
import {PestenComponent} from './gametypes/pesten/pesten.component';
import {GamebarComponent} from './gamebar/gamebar.component';
import {ChatService} from './friendlist/chatbox/chat.service';
import { NavigationbarComponent } from './navigationbar/navigationbar.component';
import { GeneralchatComponent } from './friendlist/chatbox/generalchat.component';
import { EditComponent } from './edit/edit.component';

const hiddenRoutes: Routes = [
  {
    path: '', component: HiddenComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data'
      },
      // {path:'lobby', redirectTo: ''},
      {path: 'lobby', component: GamelistComponent},
      {path: 'highscores', component: HighscoresComponent},
      {path: 'pesten', component: PestenComponent},
      {path: 'edit', component: EditComponent}
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
    GamebarComponent,
    NavigationbarComponent,
    GeneralchatComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(hiddenRoutes),
    OrderModule,
    GametypesModule
  ],
  providers: [
    ChatService
  ]
})

export class HiddenModule {}