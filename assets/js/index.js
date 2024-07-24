import { bottomSheetHandle, checkLabel, checkTextArea, numComma, focusNextInputOnMaxLength, checkInputFocus, tabMenus, dropdownMenu, headerNavActive } from "../js/ui_common.js";
import { ScrollEnterMain } from "../js/scroll_event.js";
import { circleGraphType1 } from "../js/graph_custom.js";
import { rangeOptionSelector, DateRangePicker, newMonthlyCalendar, createWeeklyCalendar } from "../js/calendar.js";
import { swiperCustom } from "../js/swiper_custom.js";

// 퍼블 환경일 경우 settimeout을 지정.
const checkPublishingFile = () => {
    const nowLocation = window.location.href;    
    if (nowLocation.includes('.html') || nowLocation.includes('https://miraeasse.netlify.app/')) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    const isPublishingEnvironment = checkPublishingFile();
    const executionTimer = isPublishingEnvironment ? 200 : 0;

    dropdownMenu('.dropdown-menu__wrap')
    checkLabel();
    checkTextArea();
    checkInputFocus();
    focusNextInputOnMaxLength('.pin-code input');
    tabMenus('.tab-content');
    ScrollEnterMain();    
    

    const isSwiperPage = () => {        
        return document.querySelector('.cardjs-01, .cardjs-02, .cardjs-03, .cardjs-video01, .cardjs-video02') !== null;
    }    
    if (isSwiperPage()) {
        swiperCustom();
    }    

    // 달력
    rangeOptionSelector('startDate2', 'endDate2');
    const calendar = new DateRangePicker('startDate', 'endDate');
    const calendar2 = new DateRangePicker('startDate2', 'endDate2');

    newMonthlyCalendar('calendarContainer', { button: false, displayData: 'dropdown' });
    createWeeklyCalendar('calendarWeekly', { button: true, displayDay: 'onlyToday' });
    
    // 커스텀 챠트
    circleGraphType1('.circlebar-js1', 75);
    
    // dom 로딩시간 체크 필요한 경우
    setTimeout(() => {
        bottomSheetHandle();
    }, executionTimer);

    // head_gnb 페이지에서만 headerNavActive() 불러오기
    const includeElements = document.querySelectorAll("[data-include-path]");

    includeElements.forEach(async (element) => {
        const includePath = element.getAttribute("data-include-path");

        if (includePath === "./_inc/head_gnb.html") {
            try {
                const response = await fetch(includePath);
                const html = await response.text();
                element.innerHTML = html;

                // 로드가 완료된 후에 호출
                headerNavActive();
            } catch (error) {
                console.error("Error loading include:", error);
            }
        }
    });
});
