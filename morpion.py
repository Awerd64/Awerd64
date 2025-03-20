#Adam  Reffad  Groupe 1
from tkinter import *
# rouge = A et vert = B

joueur = "A"
etatGrille = [ ["*","*","*"],
               ["*","*","*"],
               ["*","*","*"], ]
enCours = True


def rejouer(event):
  global etatGrille, joueur
  zoneDessin.delete("all")
  zoneDessin.bind("<Button-1>", jouer)
  tracerGrille()
  message.config(text="Partie relancée, Joueur Rouge commence", fg="red")
  etatGrille = [["*"]*3 for _ in range(3)]
  joueur = "A"
  #print(etatGrille)


def gagne():
  lg = len(etatGrille)
  
  # horizontal (parcoure la colone pour verifier les conditions de winning horizontales si y'a A ou B)
  for i in range(lg):
    if (etatGrille[0][i] == "A") and (etatGrille[1][i] == "A") and (etatGrille[2][i] == "A") or (etatGrille[0][i] == "B") and (etatGrille[1][i] == "B") and (etatGrille[2][i] == "B"):
      return True

  #vertical (parcourir la ligne pour aussi verifier les conditions de winning verticales si y'a A ou B)
  for k in range(lg):
    if (etatGrille[k][0] == "A") and (etatGrille[k][1] == "A") and (etatGrille[k][2] == "A") or (etatGrille[k][0] == "B") and (etatGrille[k][1] == "B") and (etatGrille[k][2] == "B"):
      return True
    
  # les 2 diagonales
  if (etatGrille[0][0] == "A") and (etatGrille[1][1] == "A") and (etatGrille[2][2] == "A") or (etatGrille[0][0] == "B") and (etatGrille[1][1] == "B") and (etatGrille[2][2] == "B"):
      return True
  if (etatGrille[0][2] == "A") and (etatGrille[1][1] == "A") and (etatGrille[2][0] == "A") or (etatGrille[0][2] == "B") and (etatGrille[1][1] == "B") and (etatGrille[2][0] == "B"): 
      return True
      

def jouer(event):
  global etatGrille
  global joueur
  global enCours  
  xClic = event.x
  yClic = event.y
  print(xClic, yClic)
  numLig = yClic//100 + 1
  numCol = xClic//100 + 1
  if joueur == "A":
      coul = "red"
  else:
      coul = "green"
  if joueur == "A":
      if etatGrille[numLig-1][numCol-1] != joueur and etatGrille[numLig-1][numCol-1] != "B" :
        tracerPion(numCol,numLig,coul)
        etatGrille[numLig-1][numCol-1] = joueur
        #print(etatGrille)
        joueur = "B"
        message.config(text="Au tour du joueur Vert", fg="green")
        if gagne():
          message.config(text="Joueur Rouge est le winner, fin de la partie", fg="red")
          enCours = False
          #print(enCours)
          zoneDessin.unbind("<Button-1>")
      else :
        message.config(text="Un pion est deja tracé sur cette case, cher joueur Rouge")
     
  elif joueur == "B":
     if etatGrille[numLig-1][numCol-1] != joueur and etatGrille[numLig-1][numCol-1] != "A":
       tracerPion(numCol,numLig,coul)
       etatGrille[numLig-1][numCol-1] = joueur
      #print(etatGrille)
       joueur = "A"
       message.config(text="Au tour du joueur Rouge", fg="red")
       if gagne():
         message.config(text="Joueur Vert est le winner, fin de la partie", fg="green")
         enCours = False
         #print(enCours)
         zoneDessin.unbind("<Button-1>")
     else:
        message.config(text="Un pion est deja tracé sur cette case, cher joueur Vert")
   
    
def tracerGrille():
 # horizontal
  zoneDessin.create_line(0, 100, 300, 100, fill = "red")
  zoneDessin.create_line(0, 200, 300, 200, fill = "red")
  zoneDessin.create_line(0, 300, 300, 300, fill = "red")
 # verticale
  zoneDessin.create_line(100, 0, 100, 300, fill = "red")
  zoneDessin.create_line(200, 0, 200, 300, fill = "red")
  zoneDessin.create_line(300, 0, 300, 300, fill = "red")


def tracerPion(numCol, numLig, coul):
    xCentre = numCol*100
    yCentre = numLig*100
    zoneDessin.create_oval(xCentre-25, yCentre-45, xCentre-55, yCentre-75, fill=coul)
    #zoneDessin.create_oval(xCentre-35, yCentre-55, xCentre-65, yCentre-85, fill=coul)
    
    
# programme principale
fenetre = Tk()
fenetre.title("Jeu_de_morpion")
fenetre.geometry("500x500")
message = Label(fenetre, text="Le joueur Rouge commence...", font=("Arial", 17), fg="red" )
message.pack()
bouton = Button(fenetre, text="Relancer la partie", font=("Helvetica", 20))
bouton.bind("<Button-1>", rejouer)
bouton.pack()
zoneDessin = Canvas(fenetre, width=300, height=300, bg="grey")
zoneDessin.place(relx=0.5, rely=0.5, anchor=CENTER)
zoneDessin.bind("<Button-1>", jouer)
tracerGrille()

#zoneDessin.create_line(10, 200, 10, 0, fill = "red")#(point de départ.x, point de départ.y, point de fin.x, point de fin.y)

    
    
