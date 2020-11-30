function calc(cost, rate, term, first, name = 'test') {
    rate = rate / 100;
    const trate = 1 + rate
    rows = ((cost - first) * rate * (1 / (trate ** term - 1))) - (first * rate);
    let payUp = rows;
    let count = first;
    let percentSumm = 0;
    let paySumm = first + (payUp * term);
    const payments = [];
    for (let month = 1; month <= term; month++) {
        const percents = count * rate;
        curconto = count;
        count += percents;
        count += payUp;
        // if (count <= cost) {
        //     payments.push({ curconto, count, month, percents, payUp });
        // } else {
        //     payments.push({ curconto, 'count': cost, month, percents, 'payUp': payUp - (count - cost) });
        // }
        percentSumm += percents;
        payments.push({ curconto, count, month, percents, payUp });
    }
    return { payments, cost, payUp, first, percentSumm, paySumm, term, 'rate': rate * 100, name, first };
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

class makeGraph {
    constructor(mainCls, width = '375', colors = ['#C05805', 'green', 'blue']) {
        this.colors = {};
        this.colors.percent = colors[1];
        this.colors.all = colors[0];
        this.colors.first = colors[2];
        this.width = width;
        this.height = width;
        // this.div = document.querySelector(mainCls);
        this.div = mainCls;
        this.div.style.position = 'relative';
        this.div.style.width = width + 'px'
        this.div.style.height = "100%"
        this.canvas = document.createElement('canvas');
        this.canvas.height = width;
        this.canvas.width = width;
        this.div.appendChild(this.canvas);
    }

    recreateUl(em) {
        if (this[em]) {
            this[em].querySelectorAll('li').forEach(e => e.remove());
        } else {
            this[em] = document.createElement('ul');
            this.div.appendChild(this[em]);
        }
        return this[em];
    }

    makeLegend(object) {
        this.legend = this.recreateUl('legend');
        this.legend.style.marginTop = '30px';
        this.legend.style.display = 'flex';
        this.legend.style.flexDirection = 'column';
        this.legend.style.width = '100%';
        const makeLi = (color, text) => {
            const li = document.createElement('li');
            const colorBlock = document.createElement('div');
            colorBlock.style.backgroundColor = color;
            colorBlock.style.width = this.width / 6 + 'px';
            colorBlock.style.marginRight = '5px';
            const textBlock = document.createElement('p');
            textBlock.style.textAlign = 'left';
            textBlock.innerText = text;
            li.appendChild(colorBlock);
            li.appendChild(textBlock);
            li.style.display = 'flex';
            li.style.fontSize = this.width / 25 + 'px';
            li.style.padding = '1px';
            li.style.justifyContent = "space-between"
            li.style.marginBottom = "5px";
            li.style.textTransform = 'uppercase';
            this.legend.appendChild(li);
        }
        makeLi(this.colors.percent, 'Погашено процентами: ' + parseFloat(object.percentSumm).toFixed(2));
        makeLi(this.colors.all, 'Собственные средства: ' + parseFloat(object.paySumm).toFixed(2));
        makeLi(this.colors.first, 'Начальный платёж: ' + parseFloat(object.first).toFixed(2));
        const li = document.createElement('li');
        return this.legend
    }

    makeList(object) {
        this.list = this.recreateUl('list');
        this.list.style.marginTop = '30px'
        this.list.style.display = 'flex'
        this.list.style.flexDirection = 'column'
        this.list.style.width = '100%';
        object.payments.forEach(month => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.fontSize = this.width / 27 + 'px'
            li.style.padding = '1px';
            li.style.alignItems = "center"
            li.style.justifyContent = "space-between"
            li.style.marginBottom = "5px";
            li.style.textTransform = 'uppercase';
            const monthBlock = document.createElement('p');
            const currentBlock = document.createElement('p');
            const percentsBlock = document.createElement('p');
            const nextBlock = document.createElement('p');
            const sumBlock = document.createElement('p');
            li.appendChild(monthBlock);
            li.appendChild(currentBlock);
            li.appendChild(percentsBlock);
            li.appendChild(nextBlock);
            li.appendChild(sumBlock);
            monthBlock.innerText = month.month;
            currentBlock.innerText = month.curconto.toFixed(2);
            percentsBlock.innerText = month.percents.toFixed(2);
            sumBlock.innerText = month.count.toFixed(2);
            nextBlock.innerText = month.payUp.toFixed(2);
            this.list.appendChild(li);
        });
        return this.list;
    }

    draw(object) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const maxPay = Math.max(...object.payments.map(e => e.count));
        const aspect = this.height / maxPay;
        const margin = 2;
        const barWidth = (this.width / object.payments.length) - margin;
        let x = 0;
        object.payments.forEach(month => {
            ctx.fillStyle = this.colors.percent;
            ctx.fillRect(x, this.height, barWidth, -(month.count * aspect));
            ctx.fillStyle = this.colors.all;
            ctx.fillRect(x, this.height, barWidth, -((month.count - month.percents) * aspect));
            ctx.fillStyle = this.colors.first;
            ctx.fillRect(x, this.height, barWidth, -(object.first * aspect));
            x += barWidth + margin;
        });
    }

    drawGraph(t) {
        this.draw(t);
        this.makeLegend(t);
        this.makeList(t);
    }
}

class Dialog {
    constructor(cls) {
        this.cls = cls;
        this.div = document.querySelector(cls);
        if (this.div) {

        } else {
            this.div = document.createElement('div');
            this.div.classList.add(cls);
            document.querySelector('body').appendChild(this.div);
        }
        this.validate = false;
        this.curObj = {};
    }

    createEm(tag, cls, text = '') {
        const em = document.createElement(tag);
        em.classList.add(cls);
        em.innerText = text;
        return em;
    }

    createForm(data = {}) {
        const div = this;
        const card = this.createEm('div', this.cls + '__add_form');
        const target = this.createEm('input', this.cls + '__target');
        target.placeholder = 'Ваша цель';
        if (data.name) {
            target.value = (data.name)
        }
        const cost = this.createEm('input', this.cls + '__cost');
        cost.placeholder = 'Цена'
        cost.type = 'number';
        cost.min = 1000;
        cost.value = data.cost;
        const term = this.createEm('input', this.cls + '__term');
        term.placeholder = 'Сроком на'
        term.type = 'number';
        term.min = 2;
        term.max = 631;
        term.value = (data) ? data.term : null;
        const rate = this.createEm('input', this.cls + '__rate');
        rate.placeholder = "Ставка";
        rate.type = 'number';
        rate.min = 1;
        rate.max = 99;
        rate.value = (data) ? data.rate : null;
        const first = this.createEm('input', this.cls + '__first');
        first.placeholder = "Первый платёж";
        first.type = 'number';
        first.min = 1;
        first.value = (data) ? data.first : null;
        const bet = this.createEm('input', this.cls + '__rate');
        bet.type = 'number';
        bet.value = (data) ? Number(data.payUp).toFixed(2) : undefined;
        const makePlaceholder = (text, t = 0, b = 0) => {
            const em = this.createEm('div', this.cls + '__placeholder');
            em.marginBottom = b + 'px';
            em.innerText = text;
            return em;
        }
        card.appendChild(target);
        card.appendChild(makePlaceholder('не мелочись'));
        card.appendChild(cost);
        card.appendChild(makePlaceholder('не зазнавайся'));
        card.appendChild(term);
        card.appendChild(makePlaceholder('не опаздывай'));
        card.appendChild(rate);
        card.appendChild(makePlaceholder('не мечтай'));
        card.appendChild(first);
        card.appendChild(makePlaceholder('не скупись'));
        card.appendChild(bet);
        card.appendChild(makePlaceholder('раз в месяц'));
        card.validate = function () {
            div.validate = false;
            const testTarget = /[\w\s]{1,20}/;
            if (testTarget.test(target.value)) {
                div.validate = true;

            } else { div.validate = false }
            const testNum = /\d+/;
            if (testNum.test(cost.value)) {
                div.validate = true;

            } else { div.validate = false }
            if (testNum.test(term.value)) {
                div.validate = true;

            } else { div.validate = false }
            if (testNum.test(rate.value)) {
                div.validate = true;

            } else { div.validate = false }
            if (testNum.test(first.value)) {
                div.validate = true;

            } else { div.validate = false }
            div.curObj = calc(parseFloat(cost.value), parseFloat(rate.value), parseFloat(term.value), parseFloat(first.value), target.value);
            if (Number(div.curObj.payUp.toFixed(2)) > 0) {
                bet.value = Number(div.curObj.payUp.toFixed(2));
            } else {
                div.validate = false;
            }
            if (div.validate) {
                div.btnYes.disbled = false
                div.btnYes.classList.remove(div.cls + '--btndisablet')

            } else {
                div.btnYes.disbled = true
                div.btnYes.classList.add(div.cls + '--btndisablet')
            }
        }
        card.querySelectorAll('input').forEach(e => {
            e.addEventListener('change', e => {
                e.preventDefault();
                e.stopPropagation();
                card.validate()
            });
            e.addEventListener('keyup', e => {
                e.preventDefault();
                e.stopPropagation();
                card.validate()
            });
        })
        return card;
    }


    drawAdd(closeFunc, obj = {}) {
        const div = this;
        if (this.dlg) {
            [...this.dlg.children].forEach(e => e.remove());
        } else {
            this.dlg = this.createEm('div', this.cls + '__dlg')
            this.div.appendChild(this.dlg);
        }
        const btnBlock = this.createEm('div', this.cls + '__buttons');

        this.btnYes = this.createEm('button', this.cls + '__but');
        if (Object.keys(obj).length) {
            this.btnYes.innerText = "Изменить"
        } else {
            this.btnYes.innerText = "Добавить"
        }
        this.btnYes.addEventListener('click', function (e) {
            e.preventDefault();
            if (!this.disbled) {
                closeFunc(div, this.innerText);
            }
        })
        const btnNo = this.createEm('button', this.cls + '__but', 'Назад');
        btnNo.addEventListener('click', e => {
            e.preventDefault();
            closeFunc(this, false);
            this.hide();

        })
        const form = this.createForm(obj);

        this.dlg.appendChild(form);
        this.dlg.appendChild(btnBlock);
        btnBlock.appendChild(this.btnYes);
        btnBlock.appendChild(btnNo);
        this.show();
        form.validate()
    }

    drawYesNo(messageText, closeFunc) {
        if (this.dlg) {
            [...this.dlg.children].forEach(e => e.remove());
        } else {
            this.dlg = document.createElement('div');
            this.div.appendChild(this.dlg);
        }
        this.dlg.classList.add(this.cls + '__dlg');

        const message = this.createEm('p', this.cls + '__message', messageText);
        this.dlg.appendChild(message);

        const btnBlock = this.createEm('div', this.cls + '__buttons');
        this.dlg.appendChild(btnBlock);

        const btnYes = this.createEm('button', this.cls + '__but', 'ДА');
        btnYes.addEventListener('click', e => {
            e.preventDefault();
            closeFunc(this, true);
        })
        const btnNo = this.createEm('button', this.cls + '__but', 'НЕТ');
        btnNo.addEventListener('click', e => {
            e.preventDefault();
            closeFunc(this, false);
            this.hide();
        })

        btnBlock.appendChild(btnYes);
        btnBlock.appendChild(btnNo);
        this.show();
    }

    drawGraph(data, closeFunc) {
        if (this.dlg) {
            [...this.dlg.children].forEach(e => e.remove());
        } else {
            this.dlg = document.createElement('div');
            this.div.appendChild(this.dlg);
        }
        this.dlg.classList.add(this.cls + '__dlg');

        const message = this.createEm('div', this.cls + '__graph');
        const graph = new makeGraph(message, 300);
        const em = graph.drawGraph(data);


        const btnBlock = this.createEm('div', this.cls + '__buttons');

        const btnYes = this.createEm('button', this.cls + '__but', 'Закрыть');
        btnYes.addEventListener('click', e => {
            e.preventDefault();
            closeFunc(this, true);
        })
        btnBlock.appendChild(btnYes);
        this.dlg.appendChild(message);
        this.dlg.appendChild(btnBlock);
        this.show();
    }

    show() {
        this.div.classList.add('dlg--show')
    }

    hide() {
        this.div.classList.remove('dlg--show')
    }

}

class MainList {
    constructor(cls) {
        this.cls = cls;
        this.list = []
    }

    createEm(tag, cls, text = '') {
        const em = document.createElement(tag);
        em.classList.add(cls);
        em.innerText = text;
        return em;
    }

    makeListEm(data) {
        const div = this;
        const card = this.createEm('div', this.cls + '__card');
        const target = this.createEm('p', this.cls + '__target');
        target.innerText = (data) ? data.name : '';
        const cost = this.createEm('p', this.cls + '__cost');
        cost.innerText = data.cost;
        const term = this.createEm('p', this.cls + '__term');
        term.innerText = (data) ? data.term : null;
        const rate = this.createEm('p', this.cls + '__rate');
        rate.innerText = (data) ? data.rate : null;
        const first = this.createEm('p', this.cls + '__first');
        first.innerText = (data) ? data.first : null;
        const bet = this.createEm('p', this.cls + '__monthly');
        bet.innerText = (data) ? Number(data.payUp).toFixed(2) : undefined;
        const makePlaceholder = (text, t = 0, b = 0) => {
            const em = this.createEm('span', this.cls + '__placeholder');
            em.marginBottom = b + 'px';
            em.innerText = text;
            return em;
        }
        const remove = this.createEm('img', this.cls + '__del');
        remove.src = "assets/delete.svg"
        remove.addEventListener('click', function () {
            div.removeitem(this.parentElement);
        })

        const graphBtn = this.createEm('img', this.cls + '__graph');
        graphBtn.src = "assets/graph.svg"
        graphBtn.addEventListener('click', function () {
            div.showGrapg(this.parentElement);
        })

        const editbtn = this.createEm('button', this.cls + '__edit');
        editbtn.innerText = 'Изменить';
        editbtn.addEventListener('click', function () {
            div.editem(this.parentElement, data);
        })

        card.appendChild(target);
        card.appendChild(makePlaceholder('цель'));
        card.appendChild(cost);
        card.appendChild(makePlaceholder('цена'));
        card.appendChild(term);
        card.appendChild(makePlaceholder('срок'));
        card.appendChild(rate);
        card.appendChild(makePlaceholder('ставка'));
        card.appendChild(first);
        card.appendChild(makePlaceholder('первоначальный'));
        card.appendChild(bet);
        card.appendChild(makePlaceholder('в месяц'));
        card.appendChild(remove);
        card.appendChild(graphBtn);
        card.appendChild(editbtn);
        return card;
    }

    showGrapg(em) {
        console.log(em);
    }

    editem(em) {
        console.log(em);
    }

    removeitem(em) {
        console.log(em);
    }

    addToList(obj) {
        const em = this.makeListEm(obj);
        em.dataset.id = this.list.length;
        this.list.push(obj);
        document.querySelector('.list').appendChild(em)

    }

    changeEm(em, data) {
        list.list.splice(em.dataset.id, 1, data)
        em.querySelector('.' + this.cls + '__target').innerText = data.name;
        em.querySelector('.' + this.cls + '__cost').innerText = data.cost;
        em.querySelector('.' + this.cls + '__term').innerText = data.term;
        em.querySelector('.' + this.cls + '__rate').innerText = data.rate;
        em.querySelector('.' + this.cls + '__first').innerText = data.first;
        em.querySelector('.' + this.cls + '__monthly').innerText = Number(data.payUp).toFixed(2);
    }
    recalc() {
        let sum = 0;
        this.list.forEach(e => {
            sum += e.payUp;
        })
        return 'Всего: ' + sum.toFixed(2);
    }
}

const t = {
    cost: 1500000,
    rate: 10,
    term: 20,
    first: 100000
}

const info = document.querySelector('.footer-info');
const list = new MainList('list', 'list_em');
const dlg = new Dialog('main_dlg');
list.editem = function (em) {
    dlg.drawAdd((dlg, bid) => {
        if (bid === 'Изменить') {
            list.changeEm(em, dlg.curObj)
            info.innerText = list.recalc();
        }
        dlg.hide();
    }, list.list[em.dataset.id])
}
list.removeitem = function (em) {
    dlg.drawYesNo('Точно?', (dlg, bd) => {
        if (bd) {
            em.remove();
            list.list.splice(em.dataset.id, 1);
            [...document.querySelector('.list').children].forEach((em, i) => {
                em.dataset.id = i;
            });
            info.innerText = list.recalc();
        }
        dlg.hide();
    })
}
list.showGrapg = function (em) {
    dlg.drawGraph(list.list[em.dataset.id], (dlg, bd) => {
        dlg.hide();
    });
}
const plusbutton = document.querySelector('.plusbutton');
plusbutton.addEventListener('click', e => {
    e.preventDefault();
    dlg.drawAdd((dlg, bid) => {
        if (bid === 'Добавить') {
            list.addToList(dlg.curObj)
            info.innerText = list.recalc();
        } else if (bid === 'Изменить') {

        }
        dlg.hide();
    })
})

for (let i = 1; i < 6; i++) {
    list.addToList(calc(1000000 * i, i, t.term, t.first, 'ТестоваяЦель ' + i))
}
info.innerText = list.recalc();
