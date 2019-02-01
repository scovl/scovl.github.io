---
layout: post
title: Troubleshooting - 001
snip: Resolving complex file-system problems - [EN]
tags: troubleshooting fedora 
---

Vamos pensar no seguinte cenário:

Construímos um layout de particionamento básico do filesystem do Linux:

* **/** - Partição Raiz
* **/boot** - Partição boot
* **/home** - Partição do usuário
* **swap** - Memória virtual Swap

No arquivo /etc/fstab, este layout se encontra desta maneira:

```
UUID=9038feb4-be33-4160-a95e-22bd56543c2a /                       ext4    defaults        1 1
UUID=d49db5f7-7669-474d-bcdb-15451a6e1d8c /boot                   ext4    defaults        1 2
UUID=67b83e06-bc52-463a-a73f-d05efad45a03 /home                   ext4    defaults        1 2
UUID=deedc1e3-84dd-465c-bbba-412b4643a7d3 swap                    swap    defaults        0 0
```

Nota: Veja o layout de particionamento recomendado pela Redhat : https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/installation_guide/s2-diskpartrecommend-x86.

Já com o comando lsblk, podemos ver os dispositivos listados em bloco:

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 465.8G  0 disk 
├─sda1   8:1    0     1G  0 part /boot
├─sda2   8:2    0 308.9G  0 part /home
├─sda3   8:3    0   5.9G  0 part [SWAP]
├─sda4   8:4    0     1K  0 part 
└─sda5   8:5    0   150G  0 part /
```

Digamos que o disco /boot que corresponde ao /dev/sda1 tenha sido corrompido impedindo que o sistema carregue. Neste caso, o que fazer? Geralmente o próprio linux dá uma sugestão quando ocorre este tipo de problema. A solução normalmente consiste em usar a ferramenta fsck para checar e reparar possíveis erros na partição . Geralmente o fsck é usado da seguinte maneira:

`# fsck.ext4 /dev/sda1`

> Obs: O comando acima deve ser aplicado com o disco desmontado. Consulte a manpage da ferramenta.

O comando fsck pode ser usado para solucionais em específico estes problemas abaixo:

* Blocos ou fragmentos alocados para diversos arquivos.
* inodes contendo números de bloco ou de fragmento que são sobrepostos.
* inodes contendo números de bloco ou de fragmento fora do intervalo.
* Discordâncias entre o número de referências de diretório a um arquivo e a contagem de links do arquivo.
* Blocos ou fragmentos alocados ilegalmente.
* inodes contendo números de bloco ou de fragmento que estão marcados como livres no mapeamento de disco.
* inodes contendo números de bloco ou de fragmento corrompidos.
* Um fragmento que não for o último endereço do disco em um inode. Essa verificação não se aplica a sistemas de arquivos compactados.
* Arquivos maiores que 32 KB contendo um fragmento. Essa verificação não se aplica a sistemas de arquivos compactados.
* Verificações de tamanho:
	* Número incorreto de blocos.
	* Tamanho de diretório que não for um múltiplo de 512 bytes.

Nota: Essas verificações não se aplicam a sistemas de arquivos compactados.

* Verificações de diretório:
	* Entrada de diretório contendo um número de nó-i marcado como livre no mapeamento de inode.
	* Número de nó-i fora do intervalo.
	* Ponto (.) link ausente ou não apontando para si mesmo.
	* Ponto ponto (..) link ausente ou não apontando para o diretório pai.
	* Arquivos não referenciados ou diretórios que não podem ser atingidos.
* Mapeamento de disco inconsistente.
* mapa de inode inconsistente.

Além de suas mensagens, o comando fsck registra o resultado de suas verificações e reparos por meio de seu valor de saída. Esse valor de saída pode ser qualquer soma das condições a seguir:

Valor	Descrição
0	Todos os sistemas de arquivos verificados estão ok agora.
2	O comando fsck foi interrompido antes de concluir as verificações ou os reparos.
4	O comando fsck alterou o sistema de arquivos; o usuário deve reiniciar o sistema imediatamente.
8	O sistema de arquivos contém danos não reparados.

Se o seu problema estiver relacionado a algum destes fatores acima, certamente que o fsck irá resolve-lo. Mas e se não houver relação? Se ocorrer do sistema além de estar com problemas, a distribuição estiver em uma versão já depreciada impedindo o upgrade e possível correção do problema? Certamente que formatar toda a máquina não seria uma solução agradável para este caso. Então vamos para uma das alternativas:

Tratando-se da partição /boot (que geralmente é uma partição pequena), você poderá se precaver de acidentes simplesmente gerando um backup do particionamento usando o comando `dd`:

	# dd if=/dev/sda1 conv=sync,noerror bs=64K | gzip -c  > /PATH/TO/DRIVE/backup_sda1.img.gz

E para restaurar este backup bastaria usar o seguinte comando:

	# gunzip -c /PATH/TO/DRIVE/backup_sda1.img.gz | dd of=/dev/sda1

É bastante seguro fazer isto. Na verdade, se você puder fazer backup daquilo que julga importante e necessário, é o mais apropriado a se fazer. Além disso você poderá fazer o backup do MBR:

	dd if=/dev/sda of=/PATH/TO/DRIVE/mbr-backup.img bs=512 count=1

E para restaurar:
	
	dd if=/PATH/TO/DRIVE/mbr-backup.img of=/dev/sda bs=512 count=1

Observe que a solução acima só funcionará se você já tiver planejado o backup antes visto que requer um planejamento em relação a prevenção de desastres. Se você não tiver o backup do particionamento que deseja restaurar, podemos atacar o problema de uma perspectiva diferente. Algumas perguntas poderão surgir neste cenario:

1. O que é importante salvar?
2. O que está impedindo do sistema funcionar?
3. Qual medida você tomará para evitar falhas como esta futuramente? 


