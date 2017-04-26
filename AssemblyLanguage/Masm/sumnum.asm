.model small
.stack 100h
.data
msg1 db 'Enter first number',10,13,'$'
msg2 db 'Enter Second number',10,13 ,'$'
msg3 db 'Sum is =',13,10,'$'
x db 0
y db 0
.code
mov ax,@data
mov ds,ax

mov ah,9h
lea dx,msg1
int 21h

mov ah,1h
int 21h

sub al,'0'
mov x,al

mov ah,9h
lea dx,msg2
int 21h

mov ah,1h
int 21h
sub al,'0'
mov y,al

mov ah,9h
lea dx,msg3
int 21h

mov dl,x
add dl,y

add dl,'0'

mov ah,2h
int 21h

mov ah,04ch
int 21h
END