import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { routes } from '../app-routing.module';
import { DataService } from '../shared/services/data.service';
import { STUB_DATA_SERVICE } from '../data/test-fixtures';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), HomeComponent],
      providers: [{ provide: DataService, useValue: STUB_DATA_SERVICE }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
