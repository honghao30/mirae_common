// 기간선택
export const rangeOptionSelector = (start, end) => {
    const startDateInput = document.getElementById(start);
    const endDateInput = document.getElementById(end);
    const radioButtons = document.querySelectorAll('input[name="type"]');

    const updateDates = (value) => {
        const today = dayjs().format('YYYY-MM-DD');
        let startDate;
        let endDate = today;
        endDateInput.value = endDate;   

        switch (value) {
            case '1week':
                startDate = dayjs(endDate).subtract(1, 'week').format('YYYY-MM-DD');                
                startDateInput.value = startDate;
                break;
            case '1month':
                startDate = dayjs(endDate).subtract(1, 'month').format('YYYY-MM-DD');
                startDateInput.value = startDate;                
                break;
            case '3month':
                startDate = dayjs(endDate).subtract(3, 'month').format('YYYY-MM-DD');   
                startDateInput.value = startDate;        
                break;
            case '6month':
                startDate = dayjs(endDate).subtract(6, 'month').format('YYYY-MM-DD');
                startDateInput.value = startDate;             
                break;
            default:
                startDate = null;
                endDate = null;
        }
    };

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            updateDates(event.target.value);
        });
    });
};

export class DateRangePicker {
    constructor(startDateId, endDateId) {
        this.startDateInput = document.getElementById(startDateId);
        this.endDateInput = document.getElementById(endDateId);

        if (!this.startDateInput || !this.endDateInput) {            
            return;
        }

        const today = dayjs().format('YYYY-MM-DD');
        this.startDateInput.value = today;
        this.endDateInput.value = today;

        this.startDateInput.addEventListener('change', this.handleStartDateChange.bind(this));
        this.endDateInput.addEventListener('change', this.handleEndDateChange.bind(this));
    }

    handleStartDateChange() {
        const startDate = dayjs(this.startDateInput.value);
        const endDate = dayjs(this.endDateInput.value);

        if (startDate.isAfter(endDate)) {
            this.endDateInput.value = this.startDateInput.value;
        }
    }

    handleEndDateChange() {
        const startDate = dayjs(this.startDateInput.value);
        const endDate = dayjs(this.endDateInput.value);

        if (endDate.isBefore(startDate)) {
            alert('종료일은 시작일보다 이전일 수 없습니다. 시작일로 설정됩니다.');
            this.endDateInput.value = this.startDateInput.value;
        }
    }
}


// 월간 달력
export const newMonthlyCalendar = (containerId, options) => {
    const mergedOptions = {
        button: false,
        displayData: 'default',
        dayClickCallback: null,
        ...options
    };

    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    let currentDate = dayjs();

    // 화면 로드 시 오늘 날짜 데이터를 불러오고 표시
    if (mergedOptions.dayClickCallback) {
        mergedOptions.dayClickCallback(currentDate.format('YYYYMMDD'));
    }

    displayCalendar(currentDate);

    container.querySelector('.calendar__header .btn-show-today') && container.querySelector('.calendar__header .btn-show-today').addEventListener('click', function () {
        currentDate = dayjs();
        displayCalendar(currentDate);
        if (mergedOptions.dayClickCallback) {
            mergedOptions.dayClickCallback(currentDate.format('YYYYMMDD'));
        }
    });

    if (mergedOptions.button) {
        container.querySelector('.calendar__header .btn-prev-month') && container.querySelector('.calendar__header .btn-prev-month').addEventListener('click', function () {
            currentDate = currentDate.subtract(1, 'month');
            displayCalendar(currentDate);
        });

        container.querySelector('.calendar__header .btn-next-month') && container.querySelector('.calendar__header .btn-next-month').addEventListener('click', function () {
            currentDate = currentDate.add(1, 'month');
            displayCalendar(currentDate);
        });
    } else {
        const buttons = container.querySelectorAll('.calendar__header button');
        buttons.forEach(button => button.style.display = 'none');
    }

    const handleTouchStart = (event) => {
        start_xPos = event.touches[0].pageX;
        start_yPos = event.touches[0].pageY;
        start_time = new Date();
    };

    const handleTouchEnd = (event) => {
        const end_xPos = event.changedTouches[0].pageX;
        const end_yPos = event.changedTouches[0].pageY;
        const end_time = new Date();
        let move_x = end_xPos - start_xPos;
        let move_y = end_yPos - start_yPos;
        let elapsed_time = end_time - start_time;
        if (Math.abs(move_x) > min_horizontal_move && Math.abs(move_y) < max_vertical_move && elapsed_time < within_ms) {
            if (move_x < 0) {
                currentDate = currentDate.add(1, 'month');
                displayCalendar(currentDate);
            } else {
                currentDate = currentDate.subtract(1, 'month');
                displayCalendar(currentDate);
            }
        }
    };

    const min_horizontal_move = 30;
    const max_vertical_move = 30;
    const within_ms = 1000;

    let start_xPos;
    let start_yPos;
    let start_time;

    container && container.addEventListener('touchstart', handleTouchStart);
    container && container.addEventListener('touchend', handleTouchEnd);

    const buildDropdownOptions = (currentDate) => {
        const select = document.createElement('select');
        for (let i = 0; i < 15; i++) {
            const optionDate = currentDate.subtract(i, 'month');
            const optionValue = optionDate.format('YYYY-MM');
            const optionText = optionDate.format('YYYY년 M월');
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionText;
            select.appendChild(option);
        }
        return select;
    };

    if (mergedOptions.displayData === 'dropdown') {
        const displayData = container.querySelector('.display-data');
        const select = buildDropdownOptions(currentDate);
        displayData.innerHTML = '';
        displayData.appendChild(select);

        select.addEventListener('change', function(event) {
            const selectedValue = event.target.value;
            currentDate = dayjs(selectedValue);
            displayCalendar(currentDate);
        });
    }

    function displayCalendar(date) {
        const displayData = container.querySelector('.display-data');
        const tableBody = container.querySelector('.calendar__content tbody');

        if (mergedOptions.displayData === 'dropdown') {
            const select = displayData.querySelector('select');
            if (select) {
                select.value = date.format('YYYY-MM');
            }
        } else {
            displayData.textContent = date.format('YYYY년 M월');
        }

        const firstDayOfMonth = date.startOf('month').day();
        const daysInMonth = date.daysInMonth();
        const lastDayOfPrevMonth = date.subtract(1, 'month').endOf('month').date();
        date.add(1, 'month');
        const firstDayOfNextMonth = date.startOf('month').date();

        tableBody.innerHTML = '';
        let dayIndex = 0;
        let row = tableBody.insertRow();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const cell = row.insertCell();
            const prevMonthDay = lastDayOfPrevMonth - (firstDayOfMonth - i - 1);
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = prevMonthDay;
            cell.appendChild(link);
            cell.classList.add('gray');
            dayIndex++;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = row.insertCell();
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = day;
            cell.appendChild(link);

            addUserDataToCell(cell, date.date(day));

            link.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedDay = handleDayClick(date, day);
                if (mergedOptions.dayClickCallback) {
                    mergedOptions.dayClickCallback(selectedDay);
                }
            });

            if (date.date(day).isSame(dayjs(), 'day')) {
                cell.classList.add('today');
            }

            const weekday = (firstDayOfMonth + day - 1) % 7;
            if (weekday === 0 || weekday === 6) {
                cell.classList.add('holiday');
            }

            if (++dayIndex % 7 === 0 && day < daysInMonth) {
                row = tableBody.insertRow();
            }
        }

        let nextMonthDay = 1;
        while (dayIndex % 7 !== 0) {
            const cell = row.insertCell();
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = nextMonthDay;
            cell.appendChild(link);
            cell.classList.add('gray');
            dayIndex++;
            nextMonthDay++;
        }

        const remainingCells = 7 - (dayIndex % 7);
        if (remainingCells !== 7) {
            for (let i = 0; i < remainingCells; i++) {
                const cell = row.insertCell();
                cell.classList.add('gray');
            }
        }
    }

    const handleDayClick = (date, day) => {
        const selectedDay = dayjs(date).date(day).format('YYYYMMDD');
        return selectedDay;
    };
};

// 사용자 데이터를 추가하는 함수
const addCalendarData = (cell, userData) => {
    const healthDataEl = document.createElement('div');
    healthDataEl.classList.add('health-data-wrap');
    healthDataEl.innerHTML = userData;
    cell.appendChild(healthDataEl);    
}

export const addUserDataToCell = async (cell, date) => {    
    try {
        // const response = await fetch('');
        // const userData = await response.json();

        // 예시 데이터 추가 (API 응답 형식에 맞게 변경하세요)
        const healthDataHTML = `
            <div class="dot type-meal"></div>
            <div class="dot type-work-out"></div>
            <div class="dot type-nutrition"></div>
        `;

        // API로부터 받은 데이터를 사용하여 사용자 데이터 추가
        addCalendarData(cell, healthDataHTML);

    } catch (error) {
        console.error('사용자 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
}

// 주간달력 스크립트    
export const createWeeklyCalendar = (containerId, options = {}) => {
    const container = document.getElementById(containerId);    

    if (!container) {
        // console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    const calendarHeader = container.querySelector('.calendar__header');

    // Day.js 한국어 로케일 설정
    dayjs.locale('ko');

    // Day.js 플러그인 로드
    dayjs.extend(window.dayjs_plugin_isSameOrBefore);

    let currentDate = dayjs();
    displayWeeklyCalendar(currentDate);

    // Check if 'button' option is enabled
    if (options.button) {
        const prevButton = document.createElement('button');
        prevButton.id = 'prevWeek';
        prevButton.textContent = '이전 주';
        calendarHeader.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.id = 'nextWeek';
        nextButton.textContent = '다음 주';
        calendarHeader.appendChild(nextButton);

        prevButton.addEventListener('click', function () {
            currentDate = currentDate.subtract(1, 'week');
            displayWeeklyCalendar(currentDate);
        });

        nextButton.addEventListener('click', function () {
            currentDate = currentDate.add(1, 'week');
            displayWeeklyCalendar(currentDate);
        });
    }

    function displayWeeklyCalendar(date) {
        const displayData = container.querySelector('.display-data');
        const weekDatesList = container.querySelector('#weekDates');

        const startOfWeek = date.startOf('week');
        const endOfWeek = date.endOf('week');

        // Display the date range based on 'displayDay' option
        if (options.displayDay === 'WeeklyRange') {
            displayData.textContent = `${startOfWeek.format('YYYY년 M월 D일')} - ${endOfWeek.format('M월 D일')}`;
        } else if (options.displayDay === 'onlyToday') {
            displayData.textContent = dayjs().format('YYYY-MM-DD');
        }

        weekDatesList.innerHTML = '';
        let day = startOfWeek;
        while (day.isSameOrBefore(endOfWeek)) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = ` ${day.date()}`;

            const weekLabel = document.createElement('div');
            weekLabel.classList.add('label');
            weekLabel.textContent = day.format('ddd'); // 한글 요일 추가

            // 일요일(0)과 토요일(6) 체크하여 'holiday' 클래스 추가
            if (day.day() === 0 || day.day() === 6) {
                link.classList.add('holiday');
            }

            link.href = '#none';
            link.appendChild(weekLabel); // 요일 먼저 추가
            link.appendChild(dayDiv); // 날짜 추가
            listItem.appendChild(link);
            weekDatesList.appendChild(listItem);

            // 오늘 날짜 출력
            const today = dayjs().format('YYYY-MM-DD');
            document.querySelector('.detail-section .detail-day').innerText = today;    

            // 사용자 데이터 추가
            addUserDataToWeeklyLink(link);

            // 클릭 이벤트 리스너 추가
            (function(currentDay) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleWeeklyLinkClick(currentDay);
                });
            })(day);

            // 오늘 날짜 체크하여 'today' 클래스 추가
            if (day.isSame(dayjs(), 'day')) {
                link.classList.add('today');
            }

            day = day.add(1, 'day');
        }
    }
};

const handleWeeklyLinkClick = (day) => {
    const selectedDay = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    if (selectedDay === today) {
        document.querySelector('.detail-section').innerText = '오늘';
    } else {
        document.querySelector('.detail-section').innerText = selectedDay;
    }
};

const addUserDataToWeeklyLink = (link) => {    
    const userData = document.createElement('div');
    userData.classList.add('health-data-wrap');
    userData.innerHTML = `
        <div class="dot type-meal"></div>
        <div class="dot type-work-out"></div>
        <div class="dot type-nutrition"></div>
    `; 
    link.parentElement.appendChild(userData);
};


