'use strict';

class Users {
    constructor($profile) {
        this.$profile = $profile;
        this.$button = this.$profile.find('[data-users-load]');
        this.$users = this.$profile.find('[data-users]');
        this.usersLoad();
    }

    usersLoad() {//при клике на кнопку запускается прелоадер
        this.$button.on('click', () => {
            this.preloader(true)

            fetch(`https://randomuser.me/api/?results=${this.getRandom(0, 100)}`)
			
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
					} else {//если статус ответа не ок, то выполняем Promise.reject, который возвращает отклонённый
					//promise со статусом  ошибки
					   return Promise.reject({
							status: response.status,
												
						});				
				  }
				  
                setTimeout(() => { //время ожидания прелоадера до загрузки пользователей
                    this.preloader(false, 'load-end')
                    this.initGrid(this.array);                                    
                }, 2000)
            })
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
   
    getRandom(min, max) {
        let random;
        if (min || max) {
            random = Math.floor(Math.random() * (max - min) + min);//максимум не включается, минимум включается
        } else {
            random = Math.floor(Math.random() * 100);
        }
        return random;
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
											${element.gender}
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

        userGrid.push(list);//присоединяет значения к массиву userGrid
        userGrid.push(listStats);//присоединяет значения к массиву userGrid
        userGrid.push(listNat);//присоединяет значения к массиву userGrid

        this.$users.html(userGrid.join('')); //возвращает json обращенный в объект 
    }
}

new Users($('.profile'));
