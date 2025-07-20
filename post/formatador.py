import re

def format_md(input_path, output_path):
    with open(input_path, encoding='utf-8') as f:
        lines = f.readlines()

    output = []
    buffer = []
    for line in lines:
        stripped = line.strip()

        # Títulos (ex: 1 INTRODUÇÃO, 1.1 PROCESSADORES DE LINGUAGEM)
        if re.match(r'^\d+(\.\d+)*\s', stripped):
            # Escreve buffer antes de título
            if buffer:
                output.append(' '.join(buffer))
                buffer = []
            # Nível do título
            level = stripped.count('.') + 1
            title = re.sub(r'^\d+(\.\d+)*\s*', '', stripped)
            output.append('#' * level + ' ' + title)
            continue

        # Figuras e exemplos
        if stripped.startswith('FIGURA'):
            if buffer:
                output.append(' '.join(buffer))
                buffer = []
            output.append(f'**{stripped}**')
            continue
        if stripped.startswith('EXEMPLO'):
            if buffer:
                output.append(' '.join(buffer))
                buffer = []
            output.append(f'**{stripped}**')
            continue

        # Blocos de código (detecção simples)
        if stripped.startswith('programa fonte') or stripped.startswith('entrada') or stripped.startswith('Compilador'):
            if buffer:
                output.append(' '.join(buffer))
                buffer = []
            output.append('```')
            output.append(stripped)
            continue
        if stripped.startswith('saída') or stripped.startswith('programa objeto'):
            output.append(stripped)
            output.append('```')
            continue

        # Linha em branco: fecha parágrafo
        if not stripped:
            if buffer:
                output.append(' '.join(buffer))
                buffer = []
            output.append('')
            continue

        # Junta linhas de parágrafo
        buffer.append(stripped)

    # Escreve o que sobrou
    if buffer:
        output.append(' '.join(buffer))

    # Salva resultado
    with open(output_path, 'w', encoding='utf-8') as f:
        for line in output:
            f.write(line + '\n')

if __name__ == "__main__":
    format_md('comp01.md', 'comp01_formatado.md')