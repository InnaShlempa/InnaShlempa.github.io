'use strict';

class Users {
	
    constructor($profile) {
        this.$profile = $profile;
        this.$button = this.$profile.find('[data-users-load]');
        this.$users = this.$profile.find('[data-users]');
		this.$search = this.$profile.find('[data-search]');
        this.$sortName = this.$profile.find('[data-sort-name]');
		this.$sortGender = this.$profile.find('[data-sort-gender]');
		this.$sortClear = this.$profile.find('[data-sort-clear]');
		
		this.usersLoad();
    }

    usersLoad() {//при клике на кнопку запускается прелоадер
        this.$button.on('click', () => {
            this.preloader(true)
			
            fetch(`https://randomuser.me/api/?results=${this.getRandom()}`)//получаем данные,Fetch возвращает промис
			/*конвертируем получение данные с помощью метода response.json в json, 
			этот метод возвращает promise, который, когда получен ответ, 
			вызывает коллбэк с результатом парсинга ответа в json.  */
				.then(response => {
					if (response.ok) { //если все ок, то 
					 response.json()
						.then(response => {//преобразовуем данные с json формата  в объект и дальше работаем уже как с объектом
						this.array = response.results;
						console.log('users', this.array)//вывод объекта пользователей в консоль
						})				
					} else {//если статус ответа не ок, то выполняем Promise.reject, который возвращает отклонённый promise со статусом  ошибки
					   return Promise.reject({
							status: response.status,											
						});				
				  }				  
                setTimeout(() => { //время ожидания прелоадера до загрузки пользователей
                    this.preloader(false, 'load-end')
					this.$profile.removeClass('_hide');
                    this.initGrid(this.array);  				
                    this.initFilter();
                }, 2000)
            })		
			//.catch(error => console.log('error is', error))
			.catch(() => this.preloader(false, 'error'));//если ошибка,то на прелоадер вешаем класс error
        })
    }	
	preloader(state, type) {
			if (state) {
				this.$button.addClass('preload');//на кнопку вешаем класс preload
			} else {
				this.$button.addClass(type);
			}
		}
    getRandom() {
	   return Math.floor(Math.random() * 101)//возвращает случайное целое число от 0 до 100, Math.random() возвращает число ниже 1, Math.floor() округляет до ближайшего меньшего целого.
	}
	setGender(element) {
			if (element.gender === 'female') {
				this.userWoman.push(element);// если это женский  пол, то добавляем элементы в масив userWoman
			} else  {
				this.userMan.push(element)//если не женский пол, то в userMan
			}
		}
		
	//стоим сетку профилей пользователей
    initGrid(user) {
        let userGrid = []; //инициализируем переменную, содержащую масив, который хранит сетку профилей пользователей
        let list = '';//инициализируем переменную, содержащую строку, в которой хранится разметка html профиля и выражения,обернутые в ${…}

        let userNat = [];  //инициализируем переменную, содержащую масив национальности пользователей
        let userNatLenght = [];//инициализируем переменную, содержащую масив  пользоватей с одной страны
		
        let listNat = '';//инициализируем переменную, содержащую строку, в которой хранится список национальностей
        let indexNat = 0;
        
        this.userMan = []; //инициализируем переменную, содержащую масив мужчины
        this.userWoman = []; //инициализируем переменную, содержащую масив женщины

        user.forEach((element) => { //с помощью метод forEach() стоим сетку профилей пользователей
            list += `
                            <div class='user'>
								<div class="user__wrapper">
									<div class='user__img'>
										<img src='${element.picture.large}' class="user__picture">
									</div>
									<div class='user__info'>
										<div class='user__name'>
											${element.name.title}
											${element.name.first}
											${element.name.last}                                
										</div>
										<div class='user__gender'>
											Gender: ${element.gender}
										</div>
										<div class='user__phone'>
											${element.phone}
										</div>
										<div class='user__email'>
											${element.email}
										</div>
										<div class='user__address'>
											${element.location.state}
											${element.location.city}
											${element.location.street.name}
											${element.location.street.number}
										</div>							
										<div class='user__birthday'>
											Date of Birth - ${new Date(element.dob.date).toLocaleDateString()}
										</div>
										<div class='user__registration'>
											Date of Registered - ${new Date(element.registered.date).toLocaleDateString()}
										</div>	
										<div class="user__national">
											National - ${element.nat}
										</div>										
									</div>
								</div>
                            </div>
                        `;

            this.setGender(element);
			
			//определяем количество пользователей с каждой страны
            if (!userNat.includes(element.nat)) { //определяем, содержит ли массив  элемент nat, возвращая  true 
                userNat.push(element.nat);//добавляем элементы в конец массива и возвращаем новую длину массива
                userNatLenght = user.filter(item => item.nat === element.nat);//фильтруем массив 'user' и возвращаем только тех пользователей, у которых есть свойство 'nat' со значение 'true'
                listNat += `
							<div class='users__stats'> ${userNat[indexNat++] + ` - ` + userNatLenght.length} users</div>
							`;
            }
        });
		
		//сравнение кого больше мужчин или женщмн
		let compareGender;
        if (this.userMan.length === this.userWoman.length) { // если длина масив userMan = длине масива userWoman, то равное количество
            compareGender = 'Amount of men and women is equal';
        } else if (this.userMan.length > this.userWoman.length) {
            compareGender = 'More men than women';
        } else if (this.userMan.length < this.userWoman.length) {
            compareGender = 'More women than men';
        }
		//выводим статистику: сколько всего пользователей,сколько мужчин, сколько женщин, кого больше
        let listStats = `
                            <div class='users__stats stats_users '>Amount of users : ${user.length}</div>
                            <div class='users__stats stats_users'>Man : ${this.userMan.length}</div>
                            <div class='users__stats stats_users'>Women : ${this.userWoman.length}</div>
                            <div class='users__stats stats_users'>${compareGender}</div>
                        `;

        userGrid.push(list);//присоединяем значения к массиву userGrid
        userGrid.push(listStats);//присоединяем значения к массиву userGrid
        userGrid.push(listNat);//присоединяем значения к массиву userGrid

        this.$users.html(userGrid.join('')); //возвращаем json обращенный в объект 
    }
	
	initFilter() {
        this.initSearch();
        this.initSortName(this.array);
		this.initSortGender(this.array);
		this.initsortClear();
	
    }
	initSearch() {
        let searchClear;//переменная для хранения значения, возвращаемого setTimeout()

        this.$search.on('keyup', (event) => {
            clearTimeout(searchClear);//отменяем ранее установленный вызов функции setTimeout()

            searchClear = setTimeout(() => {//Значение идентификатора, возвращаемое setTimeout(), используется в качестве параметра для метода clearTimeout().
                this.searchArray = this.array.filter(element => {// создаём новый массив searchArray со всеми элементами, прошедшими проверку, задаваемую в передаваемой функции.
                    return this.searchConfig(
                        element.name.first, 
                        element.name.last, 
                        element.phone, 
                        element.email)
						.toLowerCase()//если false,то преобразовуем и возвращаем значение строки в нижнем регистре,это дедает регистр нечувствительным к регистру(допускается поиск по запросу "john" "John" "JOHN"
						.includes(event.target.value.toLowerCase());//проверяем, содержит ли строка символы  в нижним регистре и возвращаем, true или false, запускается после каждого ввода символа
                });
                this.initGrid(this.searchArray);
            }, 250);
        });
    }

    searchConfig(...search) {//с помощью оператора расширения  вставляем массив в функцию
        return search.join(' ');// создаем и возвращаем новую строку путем конкатенации всех элементов в массиве
    }
	initSortGender(array) {
        this.sorting = false;//указываем статус сортировки false
        this.sortArray = array;

        this.$sortGender.on('click', (event) => {
            if (!this.sorting) {//если sorting = false, то меняем на true и выполняем сортировку
                this.sorting = true
				event.preventDefault()
                this.$sortGender.removeClass('female');
				this.$sortGender.addClass('male');//добавляем класс male
				
                this.sortArray = array.sort((a,b) => {//сравниваем два элемента a,b
                    return b.gender.localeCompare(a.gender);//сравниваем две строки,localeCompare()возвращает число,-1, b сортируется до a, (то есть мужчины)
                });
                this.initGrid(this.sortArray);//формируем отсортированый масив

            } else  {
                this.sorting = false
				
                this.$sortGender.removeClass('male');//удаляем класс male
				this.$sortGender.addClass('female');//добавляем класс female
							
				this.sortArray = array.sort((a,b) => {
                    return a.gender.localeCompare(b.gender);//1, а сортируется до b, (то есть женщиы)
                });		
                this.initGrid(this.sortArray);	//формируем отсортированый масив		
            }			
        });		
    }	
	initSortName(array) {
        this.sorting = false;//статус сортировки false
        this.sortArray = array;

        this.$sortName.on('click', (event) => {
            if (!this.sorting) {//если sorting = false, то меняем на true и выполняем сортировку
                this.sorting = true
				event.preventDefault()
				this.$sortName.removeClass('name');
                this.$sortName.addClass('name');
				
                this.sortArray = array.sort((a,b) => {
                    return a.name.first.localeCompare(b.name.first);
					return a.name.last.localeCompare(b.name.last);
					return b.gender.localeCompare(a.gender);
                });
                this.initGrid(this.sortArray);//формируем отсортированый масив
            } else {
                this.sorting = false

                this.$sortName.removeClass('name');
				
                this.sortArray = array.sort((a,b) => {
                    return b.name.first.localeCompare(a.name.first);
					return b.name.last.localeCompare(a.name.last);
					return a.gender.localeCompare(b.gender);					
                });
                this.initGrid(this.sortArray);//формируем отсортированый масив
            }
        });
    }	

	initsortClear() {
		this.$sortClear.on('click', () => {
			this.$sortName.removeClass('name');
			this.$sortGender.removeClass('male female');
			});
    }
}

new Users($('.profile'));
