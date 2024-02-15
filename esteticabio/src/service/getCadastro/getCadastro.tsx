import { apiService, } from "../config/apiService"


export const getCadastro = async (
    ACAO: string,
    hash: string,
    email: string,
    enderecocep: string,
    enderecologradouro: string,
    endereconumero: string,
    enderecocomplemento: string,
    enderecobairro: string,
    enderecouf: string,
    enderecomunicipio: string,
    telefone: string,
    cpf: string,
    cnpj: string,
    sexo: string,
    razaosocial: string,
    inscricaomunicipal: string,
    inscricaoestadual: string,
    site: string,
    nomecontato: string,
    telefonecontato: string,
    celularcontato: string,
    celular: string,
    nome: string,
    cdcategoria: number,
    cdclienteprofissao: number,

): Promise<{ message: string } | undefined> => {
    try {
        const result = await apiService.get('pub/process/IntegracaoWebservice', {
            params: {
                ACAO,
                hash,
                email,
                enderecocep,
                enderecologradouro,
                endereconumero,
                enderecocomplemento,
                enderecobairro,
                enderecouf,
                enderecomunicipio,
                telefone,
                cpf,
                cnpj,
                sexo,
                razaosocial,
                inscricaomunicipal,
                inscricaoestadual,
                site,
                nomecontato,
                telefonecontato,
                celularcontato,
                celular,
                nome,
                cdcategoria,
                cdclienteprofissao,
            },
        })
        console.debug('Dados antes do envio para a API:', {
            ACAO,
            hash,
            email,
            enderecocep,
            enderecologradouro,
            endereconumero,
            enderecocomplemento,
            enderecobairro,
            enderecouf,
            enderecomunicipio,
            telefone,
            sexo,
            razaosocial,
            inscricaomunicipal,
            inscricaoestadual,
            site,
            nomecontato,
            telefonecontato,
            celularcontato,
            celular,
            nome,
            cdcategoria,
            cdclienteprofissao,
        });
        if (result.status === 200) {
            console.debug('Resposta da API:', result.data);
            return
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return { message: 'algo de errado aconteceu' }
    }
}


