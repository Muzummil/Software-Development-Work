
.model small
.stack 100h
.data
	message db 0ah,0dh, "Enter the number to find even or odd $"
    	even1   db 0ah,0dh, "Number is even... $"
	odd     db 0ah,0dh, "Number is odd... $"
.code
start:
		mov ax,@data
		mov ds,ax

		lea dx,message

		mov ah,9h
		int 21h

		mov ah,1h
		int 21h
        mov bl,al
        sub bl,30h

        mov ah,1h
        int 21h
		sub al,30h        
		mov ah,bl
	
        
		mov bl,2d
	
	aad
        div bl
        cmp ah,0
		jz even2
		jnz odd1
		
        
        even2:	mov dx,OFFSET even1
		mov ah,9h
		int 21h 
		jmp terminate
		
	odd1:	mov dx, OFFSET odd
		mov ah, 9h
		int 21h
		jmp terminate
		
	terminate:	mov ax ,4c00h
		int 21h

	end start