import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarStateSubject = new BehaviorSubject<{isHidden: boolean, isCollapsed: boolean}>({
    isHidden: false,
    isCollapsed: false
  });

  sidebarState$ = this.sidebarStateSubject.asObservable();

  updateSidebarState(isHidden: boolean, isCollapsed: boolean) {
    this.sidebarStateSubject.next({ isHidden, isCollapsed });
  }

  getSidebarState() {
    return this.sidebarStateSubject.value;
  }

  showSidebar() {
    const currentState = this.sidebarStateSubject.value;
    this.sidebarStateSubject.next({ 
      isHidden: false, 
      isCollapsed: currentState.isCollapsed 
    });
  }

  hideSidebar() {
    const currentState = this.sidebarStateSubject.value;
    this.sidebarStateSubject.next({ 
      isHidden: true, 
      isCollapsed: currentState.isCollapsed 
    });
  }

  toggleSidebar() {
    const currentState = this.sidebarStateSubject.value;
    this.sidebarStateSubject.next({ 
      isHidden: !currentState.isHidden, 
      isCollapsed: currentState.isCollapsed 
    });
  }
}
