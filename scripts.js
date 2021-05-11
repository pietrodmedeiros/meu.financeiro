const modal = {
    //função para abrir o modal de nova transação
    open(){

        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    //função para fechar o modal de nova transação
    close(){
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    },

    openNegative(){

        document
            .querySelector('.modal-overlay-negative')
            .classList
            .add('active')

    },
    //função para fechar o modal de nova transação
    closeNegative(){
        document
            .querySelector('.modal-overlay-negative')
            .classList
            .remove('active')
    }
}

//função para pegar e inserir os dados no json
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("meu.financeiro:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("meu.financeiro:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    edit(index) {
        x = Transaction.all 

        console.log(x)
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    deposits() {
        let deposits = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                deposits += transaction.amount;
            }
        })
        return deposits;
    },

    outs() {
        let outs = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
                outs += transaction.amount;
            }
        })
        return outs;
    },

    total() {
        return Transaction.deposits() + Transaction.outs();
    }
}

const NewTable = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = NewTable.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        NewTable.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        where = document.getElementsByClassName("")
        const CSSclass = transaction.amount > 0 ? "deposits" : "outs"
        const amount = others.formatCurrency(transaction.amount)
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img id="click" onclick="Transaction.remove(${index})" src="./images/delete.svg" alt="excluir">
        </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('deposits-card')
            .innerHTML = others.formatCurrency(Transaction.deposits())
        document
            .getElementById('outs-card')
            .innerHTML = others.formatCurrency(Transaction.outs())
        document
            .getElementById('total-card')
            .innerHTML = others.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        NewTable.transactionsContainer.innerHTML = ""
    }
}

const others = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * (100)
        return value
    },

    formatAmountNegative(value){
        value = Number(value.replace(/\,\./g, "")) * (100) * (-1)
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    },


    //função que formata para BRL no campo de digitação do valor.
    //Não está sendo usada
    /*formatarMoeda(z) {
        v = z.value;
        v = v.replace(/\D/g, "") // permite digitar apenas numero
        v = v.replace(/(\d{1})(\d{14})$/, "$1.$2") // coloca ponto antes dos ultimos digitos
        v = v.replace(/(\d{1})(\d{11})$/, "$1.$2") // coloca ponto antes dos ultimos 11 digitos
        v = v.replace(/(\d{1})(\d{8})$/, "$1.$2") // coloca ponto antes dos ultimos 8 digitos
        v = v.replace(/(\d{1})(\d{5})$/, "$1.$2") // coloca ponto antes dos ultimos 5 digitos
        v = v.replace(/(\d{1})(\d{1,2})$/, "$1,$2") // coloca virgula antes dos ultimos 2 digitos
        z.value = v;
    }*/

}

const formulario = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: formulario.description.value,
            amount: formulario.amount.value,
            date: formulario.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = formulario.getValues()       
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = formulario.getValues()       
        amount = others.formatAmount(amount)
        date = others.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        formulario.description.value = ""
        formulario.amount.value = ""
        formulario.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            formulario.validateFields()
            const transaction = formulario.formatValues()
            Transaction.add(transaction)
            formulario.clearFields()
            modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}
const formularioNegative = {
    description: document.querySelector('input#description2'),
    amount: document.querySelector('input#amount2'),
    date: document.querySelector('input#date2'),

    getValues() {
        return {
            description: formularioNegative.description.value,
            //amount: formularioNegative.amount.value * (-1),
            amount: formularioNegative.amount.value,
            date: formularioNegative.date.value
        }

    },


    validateFields() {
        const { description, amount, date } = formularioNegative.getValues()        
        if(description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = formularioNegative.getValues()       
        amount = others.formatAmountNegative(amount)
        date = others.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        formularioNegative.description.value = ""
        formularioNegative.amount.value = ""
        formularioNegative.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            formularioNegative.validateFields()
            const transaction = formularioNegative.formatValues()
            Transaction.add(transaction)
            formularioNegative.clearFields()
            modal.closeNegative()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(NewTable.addTransaction)
        
        NewTable.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        NewTable.clearTransactions()
        App.init()
    },
}




App.init()