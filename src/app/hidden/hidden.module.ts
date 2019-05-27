import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiddenComponent} from './hidden.component'
import {Routes, RouterModule} from '@angular/router';
import {HighscoresComponent} from './highscores/highscores.component';
import {TestComponent} from './test/test.component';
// import {DataComponent} from './data/data.component';
// import {FotosComponent} from './fotos/fotos.component';

const hiddenRoutes: Routes = [
  {path:'', component: HiddenComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data'
      },
      // { path:'data', component: DataComponent},
      // { path:'fotos', component: FotosComponent}
      {path:'highscores', component: HighscoresComponent},
      {path:'profile', component: TestComponent}
    ] 
  }
]

@NgModule({
  declarations: [
    HiddenComponent,
    HighscoresComponent,
    TestComponent
    // DataComponent,
    // FotosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(hiddenRoutes),
  ],
  exports: [
    HighscoresComponent
  ]
})

export class HiddenModule {}