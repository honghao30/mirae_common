import { bottomSheetHandle, checkLabel, checkTextArea, numComma, focusNextInputOnMaxLength, checkInputFocus, tabMenus, dropdownMenu,accordion, openToast, closeToast, adjustToast} from '../assets/js/ui_common.js';
import { ScrollEnterMain } from '../assets/js/scroll_event.js';
import { circleGraphType1, circleGraphType2, circleGraphType3 } from "../assets/js/graph_custom.js";
import { rangeOptionSelector, DateRangePicker, newMonthlyCalendar, createWeeklyCalendar } from '../assets/js/calendar.js';

// 공통 영역 불러오기
document.addEventListener("DOMContentLoaded", function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/guide/header.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 기존 head 태그 제거            
            var existingHead = document.getElementsByTagName('head')[0];
            if (existingHead) {
                existingHead.parentNode.removeChild(existingHead);
            }
            // 새로운 head 태그 추가
            var headElement = document.createElement('head');
            headElement.innerHTML = xhr.responseText;
            document.documentElement.insertBefore(headElement, document.body);
        }
    };
    xhr.send();

    // 검색 기능
    const inputSearch = document.querySelector('#search-box input[type="text"]');
    const tailWindCssTable = document.querySelector('#tailwindcss-list tbody');

    if (inputSearch && tailWindCssTable) {
        inputSearch.addEventListener('keyup', function() {
            const filterValue = inputSearch.value.toLowerCase();
            const rows = tailWindCssTable.querySelectorAll('tr');

            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(filterValue) ? '' : 'none';
            });
        });
    }

    // 공통 include
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = this.responseText;
                    el.outerHTML = tempDiv.innerHTML;

                    var scripts = tempDiv.getElementsByTagName('script');
                    for (var i = 0; i < scripts.length; i++) {
                        var script = document.createElement('script');
                        script.text = scripts[i].text;
                        document.body.appendChild(script);
                    }
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });

    // 네비게이션 항목 활성화 함수
    const activateNavItem = (targetUrl) => {
        const lnbList = document.querySelectorAll(targetUrl);
        const nowUrl = window.location.href;
        const fileNameMatch = nowUrl.match(/\/([^\/]+\.html)$/);
        const fileName = fileNameMatch ? fileNameMatch[1] : null;

        if (fileName) {
            lnbList.forEach(el => {
                const elLink = el.href;
                const urlMatch = elLink.match(/\/([^\/]+\.html)$/);
                const urlName = urlMatch ? urlMatch[1] : null;

                if (fileName === urlName) {
                    el.parentNode.classList.add('is-active');
                }
                
            });
        }
    };

    // 코드 샘플을 HTML 엔티티로 변환하여 코드 보기 영역에 표시
    const convertCodeSamples = () => {
        const codeSamples = document.querySelectorAll('.sample-code');
        codeSamples.forEach(code => {
            let originCode = code.innerHTML;
            originCode = originCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const previewArea = code.nextElementSibling;
            previewArea.innerHTML = originCode;
        });
    };

    // 코드 미리보기를 포맷하여 라인 번호 추가
    const formatCodePreviews = () => {
        const preElements = document.querySelectorAll('.code_view');
        preElements.forEach(pre => {
            const content = pre.innerHTML
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            const lines = content.split('\n').map(line => line);
            let formattedCode = '';

            lines.forEach((line, index) => {
                formattedCode += `<span class="code_line"><span class="line_number">${index + 1}</span>${line}</span>\n`;
            });
            pre.innerHTML = formattedCode;
        });
    };

    // 테이블 생성 함수
    const createTable = (el, row, col) => {
        const table = document.querySelector('.' + el);
        const firstRow = table.querySelector('tr');

        for (let i = 0; i < row; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < col; j++) {
                const td = document.createElement('td');
                const numCell = firstRow.children[j];
                if (numCell.classList.contains('num')) {
                    const numValue = parseInt(numCell.innerText);
                    td.innerText = numValue + i;
                } else {
                    td.innerText = numCell.innerText;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    };

    // 날짜별 데이터 가져오기
    // const handleDayClick = newMonthlyCalendar();
    // console.log(handleDayClick);
    const getDayDetailInfo = () => {
        console.log(selectedDay)
        const displayLayer = document.querySelector('.show-data-layer')
        if (!displayLayer) {        
            return;
        }
        displayLayer.classList.add('is-show');
        displayLayer.innerText = `${selectedDay} 날 등록한 모든 데이터`;    
    }

    // 함수 실행    
    dropdownMenu('.dropdown-menu__wrap')
    // dropdownMenus.forEach(menu => {
    //     handleDropdownMenu(menu);
    // });
    checkLabel();
    checkTextArea();
    checkInputFocus();
    focusNextInputOnMaxLength('.pin-code input');
    tabMenus('.tab-content');
    ScrollEnterMain();    
    convertCodeSamples();
    formatCodePreviews();

    // 달력
    rangeOptionSelector('startDate2', 'endDate2');
    const calendar = new DateRangePicker('startDate', 'endDate');
    const calendar2 = new DateRangePicker('startDate2', 'endDate2');
    
    createWeeklyCalendar('calendarWeekly', { button: true, displayDay: 'onlyToday' });
    accordion('.acc-default');
    accordion('.acc-opentype', 0);
    // 커스텀 챠트
    circleGraphType1(".circlebar-js1", 95);
    circleGraphType1(".circlebar-js1custom", 95);
    circleGraphType2(".circlebar-js2", 119);
    circleGraphType3(".circlebar-js3", 95, 5);
    circleGraphType3(".circlebar-js4", 98, 2);
    circleGraphType3(".circlebar-js5", 90, 10);
    circleGraphType3(".circlebar-js6", 50, 50);
    circleGraphType3(".circlebar-js7", 40, 60);

    setTimeout(() => {
        activateNavItem('.navigation__wrap--top li a');
        activateNavItem('.lnb-side__wrap li a'); 
        bottomSheetHandle();       
    }, 300);

    window.openToast = openToast;
    window.closeToast = closeToast;
    window.closeToast = adjustToast;

});