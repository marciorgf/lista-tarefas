let ulTarefas = document.querySelector('#aFazer')
let fomulario = document.querySelector('form')
let input = document.querySelector('input')

const listarTarefas = (elementoHtml) => {
    fetch('http://localhost:8000/api/listar-tarefas')
    .then(resposta => resposta.json())
    .then(dados => {
        dados = dados.reverse()
        let html = ''

        dados.forEach(dado => {
            let span = dado.status == 'feito'
            ? `<span style="text-decoration: line-through">${dado.conteudo}</span>`
            : `<span>${dado.conteudo}</span>`
            html+= `
                <li class="list-group-item d-flex">
                    ${span}
                    <div class="ml-auto">
                        <a id="ConcluirTarefa" tarefa-id="${dado.id}" href="#">
                            <i title="Concluir tarefa" class="material-icons">done</i>
                        </a>
                        <a id="deletarTarefa" tarefa-id="${dado.id}" href="#">
                            <i title="Deletar tarefa" class="material-icons">delete</i>
                        </a>
                    </div>
                </li>
            `
        })
        elementoHtml.innerHTML = html
    }).then(() => {
        adicionarEventoConcluir()
        adicionarEventoDeletar()

    })
}

const adicionaTarefa = (tarefa) => {
	let dados = new FormData()	
	dados.append('conteudo', tarefa)

    fetch('http://localhost:8000/api/adicionar-tarefa', {
		method:'post',
		body: dados
	}).then(resposta => resposta.json()).then(dados => console.log(dados))
}

const adicionarEventoConcluir = () => {
    let botaoConcluir = document.querySelectorAll('#ConcluirTarefa')

    botaoConcluir.forEach(botoesConcluir => {
        botoesConcluir.onclick = (evento) => {
            evento.preventDefault()

            fetch(`http://localhost:8000/api/atualizar-tarefa/${botoesConcluir.getAttribute('tarefa-id')}`, {
                method: 'put'
            })
            .then(resposta => resposta.json())
            .then(dados => {
                if(dados.status == 'feito') {
                    botoesConcluir.parentElement.previousElementSibling.style.textDecoration = 'line-through'
                } else {
                    botoesConcluir.parentElement.previousElementSibling.style.textDecoration = 'none'
                }
            })
        }
    })
}

const adicionarEventoDeletar = () => {
    let botaoDeletar = document.querySelectorAll('#deletarTarefa')

    botaoDeletar.forEach(botoesDeletar => {
        botoesDeletar.onclick = (evento) => {
            evento.preventDefault()

            let respostaUsuario = confirm('Quer deletar essa tarefa?')

            if(respostaUsuario)

            fetch(`http://localhost:8000/api/deletar-tarefa/${botoesDeletar.getAttribute('tarefa-id')}`, {
                method: 'delete'
            })
            .then(resposta => resposta.json())
            .then(dados => {
                if(dados) {
                    botoesDeletar.parentElement.parentElement.classList.remove('d-flex')
                    botoesDeletar.parentElement.parentElement.classList.add('d-none')
                } 
            })
        }
    })
}

fomulario.onsubmit = (evento) => {
    evento.preventDefault()
    adicionaTarefa(input.value)
    listarTarefas(ulTarefas)
    input.value = ''
    input.focus()
}

listarTarefas(ulTarefas)
