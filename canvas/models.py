""" Models for canvas app """
from django.db import models

# from django.db import models

# Create your models here.

class Graph(models.Model):
    """
    Correspond to a graph

    we need a input json like
    {
        "graph_name" : "graph1",
        "layers" : [
        {
        "layers_idx" : "xxx", 
        "layers_type" : "xxx", 
        "blablabla_attributes" : "xxx"
        },
        {
        "layers_idx" : "xxx",
        "layers_type" : "xxx",
        "blablabla_attributes" : "xxx"
        }
        ]
    }
    """

    username = models.CharField(verbose_name='username', max_length=150)

    graph_name = models.CharField(verbose_name='graph name', max_length=30)

    json_data = models.TextField(verbose_name='json_data')

    class Meta:
        unique_together = (('username', 'graph_name'),)

    def __str__(self):
        return str(self.username) + ' : ' + str(self.graph_name)
