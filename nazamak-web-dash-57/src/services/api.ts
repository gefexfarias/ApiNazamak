
const API_BASE_URL = 'http://localhost:5000'; // Ajuste conforme sua configuração

export interface Product {
  CodigoProduto: string;
  Descricao: string;
  Saldo: number;
  Locacao?: string;
  Conversoes?: string[];
}

export interface NotaFiscal {
  NumeroNota: string;
  DataEmissao: string;
  Fornecedor: string;
  ValorTotal: number;
  QuantidadeItens: number;
}

export interface ProdutoNota {
  CodigoProduto: string;
  Descricao: string;
  Quantidade: number;
  ValorUnitario: number;
  Locacao?: string;
}

class ApiService {
  private async fetchWithError(url: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let message = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const data = await response.json();
          if (data && data.message) {
            message = data.message;
          }
        } catch {}
        throw new Error(message);
      }

      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o servidor Flask está rodando');
      }
      throw error;
    }
  }

  async getProduct(codigo: string): Promise<Product> {
    const response = await this.fetchWithError(`${API_BASE_URL}/api/produto/${codigo}`);
    const data = await response.json();
    
    if (!data) {
      throw new Error('Produto não encontrado');
    }
    
    return data;
  }

  async getNotesByPeriod(startDate: string, endDate: string): Promise<NotaFiscal[]> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/api/notas-entrada?inicio=${startDate}&fim=${endDate}`
    );
    return await response.json();
  }

  async getAllNotes(): Promise<NotaFiscal[]> {
    const response = await this.fetchWithError(`${API_BASE_URL}/api/notas-entrada`);
    return await response.json();
  }

  async getNoteProducts(noteNumber: string): Promise<ProdutoNota[]> {
    const response = await this.fetchWithError(`${API_BASE_URL}/api/produtos-da-nota/${noteNumber}`);
    return await response.json();
  }

  async cadastrarConversao({ codigo_principal, codigo_conversao }: { codigo_principal: string; codigo_conversao: string }): Promise<any> {
    if (!codigo_principal || !codigo_conversao) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }
    const response = await this.fetchWithError(`${API_BASE_URL}/api/conversao`, {
      method: 'POST',
      body: JSON.stringify({
        codigo_principal,
        codigo_conversao,
        nro_principal: false
      }),
    });
    return await response.json();
  }
}

export const apiService = new ApiService();
