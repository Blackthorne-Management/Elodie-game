"""Cut each cell of a Gemini sheet drawn with grid lines and stray extra figures, keep the largest figure, and
lay the cells out evenly on pure magenta: python3 scripts/quest-cells.py <src> <out.png> <cols> <rows>."""
import sys
from PIL import Image
import numpy as np
from scipy import ndimage
im=Image.open(sys.argv[1]).convert('RGB'); a=np.asarray(im).astype(int)
H,W=a.shape[:2]; r,g,b=a[...,0],a[...,1],a[...,2]
bg=(r>200)&(b>190)&(g<90)
NC,NR=int(sys.argv[3]),int(sys.argv[4]); CW,CH=W//NC+20,H//NR+20
out=Image.new('RGB',(CW*NC,CH*NR),(255,0,255))
for ri in range(NR):
    for ci in range(NC):
        x0,x1=round(ci*W/NC)+8,round((ci+1)*W/NC)-8; y0,y1=round(ri*H/NR)+8,round((ri+1)*H/NR)-8
        fg=~bg[y0:y1,x0:x1]
        lab,n=ndimage.label(fg)
        if n==0: continue
        sizes=ndimage.sum(fg,lab,range(1,n+1)); k=int(np.argmax(sizes))+1
        # keep the main figure and anything it holds (a cane, a staff): parts at least 2% of its size
        # that touch its bounding box; drop specks and a second figure standing apart
        my,mx=np.where(lab==k); top,bot,lft,rgt=my.min(),my.max(),mx.min(),mx.max()
        m=np.zeros_like(fg)
        for j in range(1,n+1):
            if sizes[j-1]<0.02*sizes[k-1]: continue
            jy,jx=np.where(lab==j)
            if j==k or (jx.max()>=lft-6 and jx.min()<=rgt+6 and jy.max()>=top-6 and jy.min()<=bot+6): m|=lab==j
        yy,xx=np.where(m)
        crop=a[y0:y1,x0:x1].copy(); crop[~m]=(255,0,255)
        fi=Image.fromarray(crop[yy.min():yy.max()+1,xx.min():xx.max()+1].astype('uint8'))
        out.paste(fi,(ci*CW+(CW-fi.width)//2, ri*CH+CH-10-fi.height))
out.save(sys.argv[2])
