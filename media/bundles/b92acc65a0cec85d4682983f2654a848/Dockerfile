FROM teamcloudcv/origami:ub14.04-py2.7-cu8.0
COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt

RUN /bin/bash setup.sh

ENTRYPOINT ["python", "main.py"]