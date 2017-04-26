[org 0x0100]
jmp start
arr: dw 15,12,9,7,5,2,0,1,14,3
swap: db 0
start:  mov bx,0
	mov byte[swap],0
loop1:  mov ax,[arr+bx]
	cmp ax,[arr+bx+2]
	jbe noswap
	mov dx,[arr+bx+2]
	mov [arr+bx+2],ax
	mov [arr+2],dx
	mov byte[swap],1
noswap: add bx,2
	cmp bx,18
	jne loop1
	cmp byte[swap],1
	je start
	mov ax,0x4c00
	int 0x21
	