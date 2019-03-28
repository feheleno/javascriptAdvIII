class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
         
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacoesView($('#negociacoesView')), 
            'adiciona', 'esvazia', 'ordena', 'ordenaInverso');
       
        this._mensagem = new Bind(
            new Mensagem(), new MensagemView($('#mensagemView')),
            'texto');

        this._ordemAtual = '';

        this._service = new NegociacaoService();

        this._init();

    }

    _init(){
        /* OBS.: esse trecho de código foi alterado consideravelmente na aula 4.6 
                 por questões de otimização.Esse comentário está sendo mantido 
                 para fins de referência.
        --------------------------------------------------------------------
        Implementação sem condensar passos, para facilitar o entendimento.
           
            ConnectionFactory
                .getConnection()
                .then(connection => {
                    new NegociacaoDao(connection)
                        .listaTodos()
                        .then(negociacoes => {
                            negociacoes.forEach(negociacao => {
                                this._listaNegociacoes.adiciona(negociacao);
                            })
                        });
                });
        
        **********************************************************************
        Implementação condensasda para ficar mais prático o código.

            ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.listaTodos())
                .then(negociacoes => {
                    negociacoes.forEach(negociacao => {
                        this._listaNegociacoes.adiciona(negociacao);
                    })
                })
                .catch(erro => {
                    console.log(erro);
                    this._mensagem.texto = erro;
                });
        */
        
        this._service
            .lista()
            .then(negociacoes => 
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao))
                )
            .catch(erro => this._mensagem.texto = erro);
            this._importaNegociacoes();
    //    setInterval(() => {
    //        this._importaNegociacoes();
    //    }, 3000);
    }
    
    adiciona(event) {
        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._service
                .cadastra(negociacao)
                .then(mensagem => {
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = mensagem;
                    this._limpaFormulario();
                })
                .catch(erro => this._mensagem.texto = erro);

        
    }
    
    apaga() {

        this._service
                .apaga()
                .then(mensagem => {
                    this._mensagem.texto = mensagem;
                    this._listaNegociacoes.esvazia();
                })
                .catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {
        if(this._ordemAtual == coluna){
            this._listaNegociacoes.ordenaInverso();
        } else {
            this._listaNegociacoes.ordena((a,b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    _importaNegociacoes() {
        this._service
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'   
            }))
            .catch(erro => this._mensagem.texto = erro);               
    }
    
    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            //Ajustado para os valores serem tratados como números ao invés de strings.
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );    
    }
    
    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
}