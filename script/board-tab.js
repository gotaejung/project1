/**
 * 하남시 게시판 탭 기능 JavaScript
 * Board Tabs Functionality for Hanam City Website
 */

// 게시판 탭 클래스
class BoardTabs {
    constructor(container) {
        this.container = container;
        this.tabButtons = container.querySelectorAll('.tab_button');
        this.tabPanels = container.querySelectorAll('.board_panel');
        this.boardItems = container.querySelectorAll('.board_item');
        this.activeClass = 'active';
        
        this.init();
    }
    
    init() {
        // 첫 번째 탭을 기본으로 활성화 (active 클래스가 없는 경우)
        const activeItem = this.container.querySelector('.board_item.active');
        if (!activeItem && this.boardItems.length > 0) {
            this.boardItems[0].classList.add(this.activeClass);
        }
        
        this.bindEvents();
        this.updateActiveTab();
    }
    
    bindEvents() {
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(index);
            });
            
            // 키보드 접근성 지원
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchTab(index);
                }
            });
        });
    }
    
    switchTab(targetIndex) {
        // 모든 탭에서 active 클래스 제거
        this.boardItems.forEach(item => {
            item.classList.remove(this.activeClass);
        });
        
        // 선택된 탭에 active 클래스 추가
        if (this.boardItems[targetIndex]) {
            this.boardItems[targetIndex].classList.add(this.activeClass);
        }
        
        this.updateActiveTab();
        
        // 탭 변경 이벤트 발생
        this.triggerTabChangeEvent(targetIndex);
    }
    
    updateActiveTab() {
        this.boardItems.forEach((item, index) => {
            const button = item.querySelector('.tab_button');
            const panel = item.querySelector('.board_panel');
            
            if (item.classList.contains(this.activeClass)) {
                // 활성 탭 설정
                button.setAttribute('aria-selected', 'true');
                button.setAttribute('aria-expanded', 'true');
                panel.setAttribute('aria-hidden', 'false');
                panel.style.display = 'block';
            } else {
                // 비활성 탭 설정
                button.setAttribute('aria-selected', 'false');
                button.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.style.display = 'none';
            }
        });
    }
    
    triggerTabChangeEvent(index) {
        const event = new CustomEvent('tabChange', {
            detail: {
                index: index,
                tabButton: this.tabButtons[index],
                boardItem: this.boardItems[index]
            }
        });
        this.container.dispatchEvent(event);
    }
    
    // 특정 탭으로 이동하는 공개 메서드
    goToTab(index) {
        if (index >= 0 && index < this.boardItems.length) {
            this.switchTab(index);
        }
    }
    
    // 현재 활성 탭 인덱스 반환
    getActiveTabIndex() {
        return Array.from(this.boardItems).findIndex(item => 
            item.classList.contains(this.activeClass)
        );
    }
}

// jQuery 플러그인 형태로도 사용 가능
if (typeof jQuery !== 'undefined') {
    (function($) {
        $.fn.boardTabs = function(options) {
            const defaults = {
                activeClass: 'active',
                onTabChange: null
            };
            
            const settings = $.extend({}, defaults, options);
            
            return this.each(function() {
                const $this = $(this);
                
                // 이미 초기화된 경우 건너뛰기
                if ($this.data('boardTabs')) {
                    return;
                }
                
                const tabInstance = new BoardTabs(this);
                $this.data('boardTabs', tabInstance);
                
                // 탭 변경 이벤트 리스너
                if (settings.onTabChange && typeof settings.onTabChange === 'function') {
                    this.addEventListener('tabChange', settings.onTabChange);
                }
            });
        };
    })(jQuery);
}

// DOM이 로드되면 자동으로 초기화
document.addEventListener('DOMContentLoaded', function() {
    // .board.tabs 클래스를 가진 모든 요소에 탭 기능 적용
    const boardTabsContainers = document.querySelectorAll('.board.tabs');
    
    boardTabsContainers.forEach(container => {
        new BoardTabs(container);
    });
});

// CSS 트랜지션 효과를 위한 스타일 추가
document.addEventListener('DOMContentLoaded', function() {
    // 동적으로 CSS 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .board.tabs .board_panel {
            transition: opacity 0.3s ease-in-out;
        }
        
        .board.tabs .board_item:not(.active) .board_panel {
            opacity: 0;
            visibility: hidden;
            height: 0;
            overflow: hidden;
        }
        
        .board.tabs .board_item.active .board_panel {
            opacity: 1;
            visibility: visible;
            height: auto;
        }
        
        .board.tabs .tab_button {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .board.tabs .board_item.active .tab_button {
            font-weight: bold;
        }
        
    `;
    document.head.appendChild(style);
});

// 전역 객체로 노출
window.BoardTabs = BoardTabs;

