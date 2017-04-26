.model small
.stack 100h
.data
msg1 db 10,13,'enter number$'
msgeven db 10,13,'number is even$'
msgodd db 10,13,'number is odd$'
;num dw 0
.code
mov ax,@data
mov ds,ax

lea dx,msg1
mov ah,9h
int 21h

mov ah,1h
int 21h

mov bl,al
sub bl,'0'

mov ah,bl

mov ah,1h
int 21h
sub al,'0'



;mov num,ax

mov bl,2
aad
div bl 

cmp al,0
je even1
jne odd1


even1: 
lea dx,msgeven
mov ah,9h
int 21h
jmp terminate

odd1: 
lea dx,msgodd
mov ah,9h
int 21h
jmp terminate



terminate: 
mov ax,04ch
int 21h
END