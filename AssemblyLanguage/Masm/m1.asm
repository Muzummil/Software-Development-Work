.model small
.stack 100h
.data

Msg db 10,13, 'Hello','$'

.code
mov ax,@data
mov ds,ax


mov ah,9h
lea dx,Msg
int 21h

mov ah,04ch
int 21h
END