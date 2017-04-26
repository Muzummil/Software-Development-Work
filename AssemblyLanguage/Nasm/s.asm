[org 0x0100]
jmp start
data: dw 15,12,3,7,5,2,0,1,14,3
swap: db 0
start:mov bx,0
      mov [swap],0
loop1:mov ax,[data+bx]
      cmp ax,[data+bx+2]
       jbe noswap
       mov dx,[data+bx+2]
       mov [data+bx+2],ax
       mov [data+bx],dx
       mov byte [swap],1
noswap: add bx,2
        cmp bx,18
        jne loop1
        cmp [swap],1
        je start
        mov ax,0x4c00
        int 0x21 