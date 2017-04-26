[org 0x0100]
	mov ax, [num1]
	add ax, [num1+2]
	add ax, [num1+4]
	mov [num1+6], ax
	mov ax,0x4c00
	int 0x21

num1: dw 5, 10, 15, 0