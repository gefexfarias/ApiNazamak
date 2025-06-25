import pyodbc
import os

def conectar():
    caminho_banco = r'C:\Users\Public\GerFinanceiro\NAZAMAK.accdb'

    if not os.path.exists(caminho_banco):
        raise FileNotFoundError(f"Arquivo não encontrado: {caminho_banco}")

    conn_str = (
        r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
        fr'DBQ={caminho_banco};'
    )
    return pyodbc.connect(conn_str)